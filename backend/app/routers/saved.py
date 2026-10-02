from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from ..models import User, SavedItem, Trend, ContentDraft
from ..schemas import SaveItemRequest

router = APIRouter(prefix="/api/saved", tags=["saved"])

def get_or_create_user(db: Session) -> User:
    user = db.query(User).first()
    if not user:
        user = User(username="Creator", tier="free")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.get("")
def get_saved_items(db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    items = db.query(SavedItem).filter(SavedItem.user_id == user.id).order_by(SavedItem.created_at.desc()).all()
    
    results = []
    for item in items:
        entry = {
            "id": item.id,
            "user_id": item.user_id,
            "item_type": item.item_type,
            "trend_id": item.trend_id,
            "draft_id": item.draft_id,
            "notes": item.notes,
            "created_at": item.created_at,
            "trend": None,
            "draft": None
        }
        if item.trend_id:
            t = db.query(Trend).filter(Trend.trend_id == item.trend_id).first()
            if t:
                entry["trend"] = {
                    "trend_id": t.trend_id,
                    "canonical_name": t.canonical_name,
                    "source": t.source,
                    "category": t.category,
                    "trend_status": t.trend_status,
                    "opportunity_score": t.opportunity_score,
                    "freshness": t.freshness,
                    "why_trending": t.why_trending,
                    "traffic_estimate": t.traffic_estimate
                }
        if item.draft_id:
            d = db.query(ContentDraft).filter(ContentDraft.id == item.draft_id).first()
            if d:
                entry["draft"] = {
                    "id": d.id,
                    "title": d.title,
                    "platform": d.platform,
                    "selected_hook": d.selected_hook,
                    "full_script": d.full_script,
                    "caption": d.caption,
                    "created_at": d.created_at
                }
        results.append(entry)
    return results

@router.post("")
def save_item(req: SaveItemRequest, db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    
    # Check if already saved
    existing = db.query(SavedItem).filter(
        SavedItem.user_id == user.id,
        SavedItem.trend_id == req.trend_id,
        SavedItem.draft_id == req.draft_id
    ).first()
    
    if existing:
        return {"message": "Already saved", "id": existing.id}
        
    saved = SavedItem(
        user_id=user.id,
        item_type=req.item_type,
        trend_id=req.trend_id,
        draft_id=req.draft_id,
        notes=req.notes
    )
    db.add(saved)
    user.trend_hunter_points = (user.trend_hunter_points or 50) + 10  # 10 pts for saving
    db.commit()
    db.refresh(saved)
    
    return {"message": "Item saved successfully", "id": saved.id}

@router.delete("/{item_id}")
def delete_saved_item(item_id: str, db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    saved = db.query(SavedItem).filter(SavedItem.id == item_id, SavedItem.user_id == user.id).first()
    if not saved:
        raise HTTPException(status_code=404, detail="Saved item not found")
        
    db.delete(saved)
    db.commit()
    return {"message": "Item deleted"}
