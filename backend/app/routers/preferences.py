from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, UserPreference
from ..schemas import UserPreferenceBase, UserPreferenceResponse

router = APIRouter(prefix="/api/preferences", tags=["preferences"])

def get_or_create_user(db: Session) -> User:
    user = db.query(User).first()
    if not user:
        user = User(username="Creator", tier="free")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.get("", response_model=UserPreferenceResponse)
def get_preferences(db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    pref = db.query(UserPreference).filter(UserPreference.user_id == user.id).first()
    if not pref:
        pref = UserPreference(
            user_id=user.id,
            niche="Technology",
            country="VN",
            language="vi",
            platforms=["TikTok", "YouTube Short", "Instagram Reel"],
            audience="Gen Z & Tech Enthusiasts in Vietnam",
            tone="Educational & Bold",
            content_goal="Engagement & Followers",
            experience_level="Intermediate"
        )
        db.add(pref)
        db.commit()
        db.refresh(pref)
    return pref

@router.put("", response_model=UserPreferenceResponse)
def update_preferences(data: UserPreferenceBase, db: Session = Depends(get_db)):
    user = get_or_create_user(db)
    pref = db.query(UserPreference).filter(UserPreference.user_id == user.id).first()
    if not pref:
        pref = UserPreference(user_id=user.id)
        db.add(pref)
    
    pref.niche = data.niche
    pref.country = data.country
    pref.language = data.language
    pref.platforms = data.platforms
    pref.audience = data.audience
    pref.tone = data.tone
    pref.content_goal = data.content_goal
    pref.experience_level = data.experience_level
    
    db.commit()
    db.refresh(pref)
    return pref
