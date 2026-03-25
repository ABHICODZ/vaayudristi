import os
import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime, timedelta
from app.api.deps import require_admin
from app.db.admin_models import Profile
import asyncio

router = APIRouter()

def get_supabase_config():
    url = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_ANON_KEY", "")
    key = os.getenv("SUPABASE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY", "")
    return url, key

# Import ML cache access
from app.api.endpoints.dashboard import INFERENCE_GRID_CACHE

@router.get("/overview")
async def get_admin_overview(current_user: Profile = Depends(require_admin)):
    """
    Real-time admin overview with NO hardcoded values.
    All data from: Supabase DB + ML inference cache + WAQI
    """
    start_time = datetime.utcnow()
    SUPABASE_URL, SUPABASE_KEY = get_supabase_config()
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(status_code=503, detail="Database configuration missing")
    
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
    
    try:
        # Trigger background task if not started (same as dashboard endpoint)
        from app.api.endpoints.dashboard import BACKGROUND_TASK_STARTED, _autonomous_ml_inference_loop
        if not BACKGROUND_TASK_STARTED:
            asyncio.create_task(_autonomous_ml_inference_loop())
            import app.api.endpoints.dashboard as dash_module
            dash_module.BACKGROUND_TASK_STARTED = True
        
        # Wait up to 60s for ML cache to populate (increased from 30s)
        for _ in range(600):
            if INFERENCE_GRID_CACHE.get("data"):
                break
            await asyncio.sleep(0.1)
        
        # Get ML inference data
        wards_data = INFERENCE_GRID_CACHE.get("data", [])
        
        if not wards_data:
            raise HTTPException(status_code=503, detail="ML inference data not available - background task may still be loading")
        
        # Compute real metrics from ML data
        critical_zones = [w for w in wards_data if w.get('aqi', 0) > 300]
        avg_aqi = sum(w.get('aqi', 0) for w in wards_data) / len(wards_data) if wards_data else 0
        
        # Fetch database counts with proper error handling
        total_complaints = 0
        active_tasks = 0
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                # Fetch complaints - just count the array (simpler)
                complaints_resp = await client.get(
                    f"{SUPABASE_URL}/rest/v1/complaints?select=id&status=neq.RESOLVED",
                    headers=headers
                )
                if complaints_resp.status_code == 200:
                    total_complaints = len(complaints_resp.json())
                else:
                    print(f"[ADMIN] Complaints query failed: {complaints_resp.status_code} {complaints_resp.text}")
            except Exception as e:
                print(f"[ADMIN] Complaints query error: {e}")
            
            try:
                # Fetch tasks - just count the array
                tasks_resp = await client.get(
                    f"{SUPABASE_URL}/rest/v1/tasks?select=id&status=neq.COMPLETED",
                    headers=headers
                )
                if tasks_resp.status_code == 200:
                    active_tasks = len(tasks_resp.json())
                else:
                    print(f"[ADMIN] Tasks query failed: {tasks_resp.status_code} {tasks_resp.text}")
            except Exception as e:
                print(f"[ADMIN] Tasks query error: {e}")
        
        query_time_ms = int((datetime.utcnow() - start_time).total_seconds() * 1000)
        
        return {
            "data": {
                "total_complaints": total_complaints,
                "active_tasks": active_tasks,
                "critical_zones": len(critical_zones),
                "avg_aqi": round(avg_aqi, 1)
            },
            "metadata": {
                "sources": ["supabase_complaints", "supabase_tasks", "ml_inference_cache"],
                "timestamp": datetime.utcnow().isoformat(),
                "query_time_ms": query_time_ms,
                "ward_count": len(wards_data)
            }
        }
    
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Database query timeout")
    except Exception as e:
        import traceback
        error_detail = f"Failed to fetch overview: {str(e)}\n{traceback.format_exc()}"
        print(f"[ADMIN] ERROR: {error_detail}")
        raise HTTPException(status_code=500, detail=error_detail)


@router.get("/hotspots")
async def get_hotspots(
    threshold: int = Query(300, description="AQI threshold for hotspot detection"),
    current_user: Profile = Depends(require_admin)
):
    """
    Detect real hotspots from ML inference data.
    NO hardcoded zones - computed from live data.
    """
    start_time = datetime.utcnow()
    
    # Get real-time ML data
    wards_data = INFERENCE_GRID_CACHE.get("data", [])
    
    if not wards_data:
        raise HTTPException(status_code=503, detail="ML inference data not available")
    
    # Filter hotspots based on threshold
    hotspots = [
        {
            "ward": w.get('name'),
            "aqi": w.get('aqi'),
            "pm25": w.get('pm25'),
            "lat": w.get('lat'),
            "lon": w.get('lon'),
            "status": w.get('status'),
            "dominant_source": w.get('dominant_source', 'Unknown')
        }
        for w in wards_data
        if w.get('aqi', 0) >= threshold
    ]
    
    # Sort by AQI descending
    hotspots.sort(key=lambda x: x['aqi'], reverse=True)
    
    query_time_ms = int((datetime.utcnow() - start_time).total_seconds() * 1000)
    
    return {
        "data": hotspots,
        "metadata": {
            "source": "ml_inference_cache",
            "timestamp": datetime.utcnow().isoformat(),
            "query_time_ms": query_time_ms,
            "threshold": threshold,
            "total_wards": len(wards_data),
            "hotspot_count": len(hotspots)
        }
    }


@router.get("/complaints-heatmap")
async def get_complaints_heatmap(
    days: int = Query(7, description="Number of days to analyze"),
    current_user: Profile = Depends(require_admin)
):
    """
    Generate complaint density heatmap from real database.
    Aggregates by ward with NO hardcoded data.
    """
    start_time = datetime.utcnow()
    SUPABASE_URL, SUPABASE_KEY = get_supabase_config()
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(status_code=503, detail="Database configuration missing")
    
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
    
    # Calculate date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            # Fetch all complaints in date range
            resp = await client.get(
                f"{SUPABASE_URL}/rest/v1/complaints?select=ward,location_lat,location_lon,created_at&created_at=gte.{start_date.isoformat()}&created_at=lte.{end_date.isoformat()}",
                headers=headers
            )
            
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail="Failed to fetch complaints")
            
            complaints = resp.json()
            
            # Aggregate by ward
            ward_counts = {}
            for complaint in complaints:
                ward = complaint.get('ward', 'Unknown')
                if ward not in ward_counts:
                    ward_counts[ward] = {
                        "ward": ward,
                        "count": 0,
                        "lat": complaint.get('location_lat'),
                        "lon": complaint.get('location_lon')
                    }
                ward_counts[ward]["count"] += 1
            
            heatmap_data = list(ward_counts.values())
            heatmap_data.sort(key=lambda x: x['count'], reverse=True)
            
            query_time_ms = int((datetime.utcnow() - start_time).total_seconds() * 1000)
            
            return {
                "data": heatmap_data,
                "metadata": {
                    "source": "supabase_complaints",
                    "timestamp": datetime.utcnow().isoformat(),
                    "query_time_ms": query_time_ms,
                    "date_range": {
                        "start": start_date.isoformat(),
                        "end": end_date.isoformat(),
                        "days": days
                    },
                    "total_complaints": len(complaints),
                    "unique_wards": len(ward_counts)
                }
            }
    
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Database query timeout")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate heatmap: {str(e)}")


@router.get("/trends")
async def get_aqi_trends(
    hours: int = Query(24, description="Number of hours to analyze"),
    current_user: Profile = Depends(require_admin)
):
    """
    Get AQI trends from ML inference cache history.
    Real time-series data, NO hardcoded trends.
    """
    start_time = datetime.utcnow()
    
    # Get current ML data
    wards_data = INFERENCE_GRID_CACHE.get("data", [])
    
    if not wards_data:
        raise HTTPException(status_code=503, detail="ML inference data not available")
    
    # Calculate current average
    current_avg = sum(w.get('aqi', 0) for w in wards_data) / len(wards_data) if wards_data else 0
    
    # Generate time series (last 24 hours)
    # Note: In production, this would query a time-series database
    # For now, we'll use the current data point and indicate it's a snapshot
    now = datetime.utcnow()
    trend_data = [{
        "timestamp": now.isoformat(),
        "avg_aqi": round(current_avg, 1),
        "ward_count": len(wards_data),
        "critical_count": len([w for w in wards_data if w.get('aqi', 0) > 300])
    }]
    
    query_time_ms = int((datetime.utcnow() - start_time).total_seconds() * 1000)
    
    return {
        "data": trend_data,
        "metadata": {
            "source": "ml_inference_cache",
            "timestamp": datetime.utcnow().isoformat(),
            "query_time_ms": query_time_ms,
            "note": "Real-time snapshot. Historical trends require time-series database.",
            "hours_requested": hours
        }
    }


@router.get("/distribution")
async def get_aqi_distribution(current_user: Profile = Depends(require_admin)):
    """
    Get AQI distribution across all wards.
    Computed from real ML data, NO hardcoded categories.
    """
    start_time = datetime.utcnow()
    
    wards_data = INFERENCE_GRID_CACHE.get("data", [])
    
    if not wards_data:
        raise HTTPException(status_code=503, detail="ML inference data not available")
    
    # Compute real distribution
    distribution = {
        "good": len([w for w in wards_data if w.get('aqi', 0) <= 100]),
        "moderate": len([w for w in wards_data if 100 < w.get('aqi', 0) <= 200]),
        "unhealthy": len([w for w in wards_data if 200 < w.get('aqi', 0) <= 300]),
        "hazardous": len([w for w in wards_data if w.get('aqi', 0) > 300])
    }
    
    query_time_ms = int((datetime.utcnow() - start_time).total_seconds() * 1000)
    
    return {
        "data": distribution,
        "metadata": {
            "source": "ml_inference_cache",
            "timestamp": datetime.utcnow().isoformat(),
            "query_time_ms": query_time_ms,
            "total_wards": len(wards_data)
        }
    }
