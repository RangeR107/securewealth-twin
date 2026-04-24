"""
Security tab endpoints: risk summary, default audit timeline + signals.
Live incident-specific timelines live under /incidents/{id}.
"""
from fastapi import APIRouter, HTTPException

from app.data.audit import AUDIT_SIGNALS, AUDIT_TIMELINE
from app.data.profiles import PROFILES
from app.schemas import AuditSignal, AuditTimelineNode, ProfileKey

router = APIRouter(prefix="/security", tags=["security"])


@router.get("/{profile_key}")
def get_security_summary(profile_key: ProfileKey) -> dict:
    if profile_key not in PROFILES:
        raise HTTPException(status_code=404, detail="Unknown profile")
    p = PROFILES[profile_key]
    return {
        "riskLevel": p.riskLevel,
        "stressIndex": p.stressIndex,
        "securityHealth": p.securityHealth,
    }


@router.get("/audit/timeline", response_model=list[AuditTimelineNode])
def get_audit_timeline() -> list[AuditTimelineNode]:
    return AUDIT_TIMELINE


@router.get("/audit/signals", response_model=list[AuditSignal])
def get_audit_signals() -> list[AuditSignal]:
    return AUDIT_SIGNALS
