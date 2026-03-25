# Enterprise Admin System Architecture

## DATA SOURCES (REAL)

### 1. Supabase Database
- **complaints** table (citizen reports)
- **tasks** table (admin assignments)
- **alerts** table (system-generated)
- **profiles** table (user data)
- **audit_logs** table (all actions)

### 2. Live AQI Data
- WAQI API (42 real monitoring stations)
- ML inference (251 ward predictions)
- Refresh: 30-second intervals

### 3. Satellite Data
- Google Earth Engine (Sentinel-5P)
- Aerosol Index, CO levels
- On-demand queries

### 4. ML Model Outputs
- Temporal Neural Network predictions
- Real-time inference cache
- 8-day forecasts

## SYSTEM LAYERS

### Layer 1: DATA INGESTION
**Backend Endpoints (NEW):**
```
GET  /api/v1/admin/analytics/overview
GET  /api/v1/admin/analytics/trends?start_date=X&end_date=Y
GET  /api/v1/admin/analytics/hotspots?threshold=300
GET  /api/v1/admin/analytics/complaints-heatmap
GET  /api/v1/admin/analytics/time-series?metric=aqi&ward=X
POST /api/v1/admin/agents/query
```

**Data Flow:**
1. Fetch from Supabase (complaints, tasks, alerts)
2. Fetch from WAQI (live AQI)
3. Fetch from ML cache (predictions)
4. Aggregate in real-time
5. Return with metadata (source, timestamp)

### Layer 2: ANALYTICS ENGINE
**Computations (REAL):**
- Complaint density per ward (COUNT GROUP BY)
- AQI trends (time-series aggregation)
- Hotspot detection (spatial clustering)
- Anomaly detection (statistical outliers)
- Correlation analysis (complaints vs AQI)

**Performance:**
- Use database indexes
- Pagination (50 items/page)
- Caching (5-minute TTL)
- Lazy loading for charts

### Layer 3: AGENTIC INTELLIGENCE
**AI Agents (REAL LOGIC):**

1. **Analyst Agent**
   - Query: "Why is AQI high in Dwarka?"
   - Process: Fetch GEE data + complaints + wind patterns
   - Response: Data-backed analysis

2. **Recommender Agent**
   - Query: "What actions needed in critical zones?"
   - Process: Fetch hotspots + available resources
   - Response: Prioritized action list

3. **Predictor Agent**
   - Query: "Will AQI improve tomorrow?"
   - Process: Fetch ML forecast + weather data
   - Response: Probability-based prediction

**Agent Response Format:**
```json
{
  "query": "user question",
  "data_sources": ["waqi", "gee", "complaints_db"],
  "analysis": "reasoning",
  "confidence": 0.87,
  "timestamp": "2026-03-24T20:00:00Z",
  "supporting_data": {...}
}
```

### Layer 4: ADMIN INTERFACE
**Components (NO HARDCODING):**

1. **Real-Time Dashboard**
   - Fetch `/admin/analytics/overview` every 30s
   - Show: total complaints, active tasks, critical zones, avg AQI
   - Display source + timestamp for each metric

2. **Multi-Filter Map**
   - Layer 1: AQI heatmap (from ML cache)
   - Layer 2: Complaint markers (from DB)
   - Layer 3: Satellite overlay (from GEE)
   - Filters: time range, ward, severity
   - Update on filter change

3. **Analytics Charts**
   - Trend Chart: Fetch time-series data
   - Distribution: Compute from live wards data
   - Complaint Heatmap: Spatial aggregation
   - All charts show "Last updated: X"

4. **Agent Query Panel**
   - Input: Natural language question
   - POST to `/admin/agents/query`
   - Display: Response with data sources
   - Show confidence score

5. **Incident Manager**
   - Auto-detect: Fetch hotspots API
   - Create tasks: POST to tasks endpoint
   - Assign: Update task with assignee
   - Track: Real-time status updates

## DATABASE SCHEMA (EXISTING + NEW)

### New Tables Needed:
```sql
-- Agent query logs
CREATE TABLE agent_queries (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES profiles(id),
  query TEXT NOT NULL,
  response JSONB NOT NULL,
  data_sources TEXT[],
  confidence FLOAT,
  processing_time_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics cache (5-min TTL)
CREATE TABLE analytics_cache (
  cache_key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

-- Hotspot detections
CREATE TABLE hotspots (
  id UUID PRIMARY KEY,
  ward TEXT NOT NULL,
  aqi FLOAT NOT NULL,
  complaint_count INT NOT NULL,
  severity TEXT NOT NULL,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
```

## API ENDPOINTS (NEW)

### Analytics Endpoints
```python
@router.get("/admin/analytics/overview")
async def get_overview():
    # Fetch real data from DB + ML cache
    complaints = await db.execute("SELECT COUNT(*) FROM complaints WHERE status != 'RESOLVED'")
    tasks = await db.execute("SELECT COUNT(*) FROM tasks WHERE status != 'COMPLETED'")
    wards = fetch_ml_cache()  # Real ML predictions
    critical = [w for w in wards if w['aqi'] > 300]
    
    return {
        "total_complaints": complaints,
        "active_tasks": tasks,
        "critical_zones": len(critical),
        "avg_aqi": sum(w['aqi'] for w in wards) / len(wards),
        "source": "supabase+ml_cache",
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/admin/analytics/trends")
async def get_trends(start_date: str, end_date: str):
    # Query time-series data
    query = """
        SELECT DATE_TRUNC('hour', created_at) as hour,
               AVG(aqi) as avg_aqi,
               COUNT(*) as complaint_count
        FROM complaints
        WHERE created_at BETWEEN $1 AND $2
        GROUP BY hour
        ORDER BY hour
    """
    results = await db.fetch(query, start_date, end_date)
    return {
        "data": results,
        "source": "supabase",
        "timestamp": datetime.utcnow().isoformat()
    }

@router.post("/admin/agents/query")
async def agent_query(query: str):
    # Real agent logic
    if "why" in query.lower() and "aqi" in query.lower():
        # Extract ward from query
        ward = extract_ward(query)
        
        # Fetch real data
        gee_data = await fetch_gee(ward)
        complaints = await db.fetch("SELECT * FROM complaints WHERE ward = $1", ward)
        aqi_data = get_ml_cache_for_ward(ward)
        
        # Analyze
        analysis = f"AQI in {ward} is {aqi_data['aqi']}. "
        if gee_data['biomass_burning_index'] > 0.04:
            analysis += "Satellite data shows biomass burning. "
        if len(complaints) > 10:
            analysis += f"{len(complaints)} citizen complaints filed. "
        
        return {
            "query": query,
            "analysis": analysis,
            "data_sources": ["gee", "ml_cache", "complaints_db"],
            "confidence": 0.89,
            "supporting_data": {
                "gee": gee_data,
                "complaints": len(complaints),
                "aqi": aqi_data
            },
            "timestamp": datetime.utcnow().isoformat()
        }
```

## PERFORMANCE METRICS

### Target Response Times:
- Overview: < 500ms
- Trends: < 1s
- Hotspots: < 2s
- Agent Query: < 5s
- Map Data: < 1s

### Optimization:
- Database indexes on: ward, created_at, status
- Connection pooling (10 connections)
- Query result caching (5-min TTL)
- Pagination (50 items/page)
- Lazy loading for charts

## DATA TRACEABILITY

Every response includes:
```json
{
  "data": {...},
  "metadata": {
    "source": "supabase+ml_cache",
    "timestamp": "2026-03-24T20:00:00Z",
    "query_time_ms": 234,
    "cache_hit": false
  }
}
```

## ERROR HANDLING

If data unavailable:
```json
{
  "error": "Data source unavailable",
  "source": "waqi_api",
  "attempted_at": "2026-03-24T20:00:00Z",
  "retry_after": 60
}
```

## TESTING REQUIREMENTS

1. **Data Validation:**
   - Verify no hardcoded values
   - Check all timestamps are real
   - Confirm sources are labeled

2. **Filter Testing:**
   - Change time range → data changes
   - Change ward → map updates
   - Change severity → list filters

3. **Performance Testing:**
   - Load 1000 complaints → < 2s
   - Query 30-day trends → < 3s
   - Agent query → < 5s

## DEPLOYMENT CHECKLIST

- [ ] All endpoints return real data
- [ ] All charts fetch from API
- [ ] All metrics show source + timestamp
- [ ] Filters work correctly
- [ ] Agent queries use real logic
- [ ] No mock/demo data exists
- [ ] Performance targets met
- [ ] Error states handled
