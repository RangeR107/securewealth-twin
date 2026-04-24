"""
Wealth-intelligence endpoints: leaks, life events.
These are derived from the profile store so adding a new profile
automatically exposes matching endpoints.
"""
from fastapi import APIRouter, HTTPException

from app.data.profiles import PROFILES
from app.schemas import LifeEvent, ProfileKey, WealthLeak

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("/{profile_key}/leaks", response_model=list[WealthLeak])
def get_leaks(profile_key: ProfileKey) -> list[WealthLeak]:
    if profile_key not in PROFILES:
        raise HTTPException(status_code=404, detail="Unknown profile")
    return PROFILES[profile_key].leaks


@router.get("/{profile_key}/life-event", response_model=LifeEvent)
def get_life_event(profile_key: ProfileKey) -> LifeEvent:
    if profile_key not in PROFILES:
        raise HTTPException(status_code=404, detail="Unknown profile")
    return PROFILES[profile_key].event


@router.get("/{profile_key}/summary")
def get_summary(profile_key: ProfileKey) -> dict:
    """Dashboard header aggregation — immune/wealth/security/resilience scores."""
    if profile_key not in PROFILES:
        raise HTTPException(status_code=404, detail="Unknown profile")
    p = PROFILES[profile_key]
    return {
        "immuneScore": p.immuneScore,
        "wealthHealth": p.wealthHealth,
        "securityHealth": p.securityHealth,
        "resilience": p.resilience,
        "stressIndex": p.stressIndex,
        "riskLevel": p.riskLevel,
        "portfolio": p.portfolio,
        "persona": p.persona,
    }
