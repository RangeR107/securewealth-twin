"""
Guardian feature endpoints.
"""
from fastapi import APIRouter, HTTPException

from app.schemas import Guardian, GuardianRequestBody, ProfileKey
from app.services.guardian_service import guardian_store

router = APIRouter(prefix="/guardians", tags=["guardians"])


@router.post("", response_model=Guardian)
def add_guardian(body: GuardianRequestBody) -> Guardian:
    if not body.consent:
        raise HTTPException(status_code=400, detail="Consent is required")
    return guardian_store.add(body)


@router.get("/{profile_key}", response_model=list[Guardian])
def list_guardians(profile_key: ProfileKey) -> list[Guardian]:
    return guardian_store.list_for(profile_key)


@router.delete("/{guardian_id}", response_model=Guardian)
def revoke_guardian(guardian_id: str) -> Guardian:
    g = guardian_store.revoke(guardian_id)
    if not g:
        raise HTTPException(status_code=404, detail="Guardian not found")
    return g
