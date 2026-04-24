"""
Profile + scenario endpoints. Dashboard data lives here.
"""
from fastapi import APIRouter, HTTPException

from app.data.profiles import PROFILES
from app.data.scenarios import SCENARIOS
from app.schemas import ProfileKey, Scenario, UserProfile

router = APIRouter(tags=["profiles"])


@router.get("/profiles", response_model=dict[str, UserProfile])
def list_profiles() -> dict[str, UserProfile]:
    """All profiles keyed by ProfileKey — mirrors the frontend PROFILES constant."""
    return PROFILES


@router.get("/profiles/{profile_key}", response_model=UserProfile)
def get_profile(profile_key: ProfileKey) -> UserProfile:
    if profile_key not in PROFILES:
        raise HTTPException(status_code=404, detail="Unknown profile")
    return PROFILES[profile_key]


@router.get("/scenarios", response_model=dict[str, Scenario])
def list_scenarios() -> dict[str, Scenario]:
    return SCENARIOS


@router.get("/scenarios/{scenario_key}", response_model=Scenario)
def get_scenario(scenario_key: str) -> Scenario:
    if scenario_key not in SCENARIOS:
        raise HTTPException(status_code=404, detail="Unknown scenario")
    return SCENARIOS[scenario_key]
