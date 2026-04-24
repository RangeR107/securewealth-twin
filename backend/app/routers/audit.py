"""
System-wide audit log — append-only, for the Audit Trail / History timeline.
Separate from per-incident timelines (those live under /incidents/{id}).
"""
from fastapi import APIRouter, Query

from app.schemas import AuditLogResponse, ProfileKey
from app.services.audit_service import audit_store

router = APIRouter(prefix="/audit-log", tags=["audit"])


@router.get("", response_model=AuditLogResponse)
def list_audit_log(
    profileKey: ProfileKey | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
) -> AuditLogResponse:
    items = audit_store.list(profile_key=profileKey, limit=limit)
    return AuditLogResponse(items=items, total=audit_store.total(profileKey))
