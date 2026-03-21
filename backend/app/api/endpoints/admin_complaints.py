from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.db.database import get_db
from app.db.admin_models import Complaint, Profile
from app.schemas.admin_schemas import ComplaintCreate, ComplaintUpdate, ComplaintResponse
from app.api.deps import require_admin, get_current_user

router = APIRouter()

@router.get("/", response_model=List[ComplaintResponse])
async def list_complaints(
    status: Optional[str] = None,
    ward: Optional[str] = None,
    current_user: Profile = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    query = select(Complaint)
    if status:
        query = query.where(Complaint.status == status)
    if ward:
        query = query.where(Complaint.ward == ward)
        
    query = query.order_by(Complaint.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/", response_model=ComplaintResponse)
async def create_complaint(
    complaint: ComplaintCreate,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_complaint = Complaint(**complaint.model_dump())
    # Ensure they can only file under their own ID or they are an admin filing for someone else
    if new_complaint.citizen_id != current_user.id and current_user.role not in ['admin', 'officer']:
        raise HTTPException(status_code=403, detail="Cannot file complaint for another user")
        
    db.add(new_complaint)
    await db.commit()
    await db.refresh(new_complaint)
    return new_complaint

@router.patch("/{complaint_id}/status", response_model=ComplaintResponse)
async def update_complaint_status(
    complaint_id: UUID,
    complaint_update: ComplaintUpdate,
    current_user: Profile = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Complaint).where(Complaint.id == complaint_id))
    complaint = result.scalars().first()
    
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    if complaint_update.status:
        complaint.status = complaint_update.status
        if complaint_update.status in ['RESOLVED', 'REJECTED']:
            complaint.resolved_at = datetime.utcnow()
            
    if complaint_update.assigned_to:
        complaint.assigned_to = complaint_update.assigned_to
        
    if complaint_update.internal_notes:
        complaint.internal_notes = complaint_update.internal_notes

    await db.commit()
    await db.refresh(complaint)
    return complaint
