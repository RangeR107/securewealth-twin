"""
Incident endpoints — powers OfficerView and FraudAlert screens.
"""
from fastapi import APIRouter, HTTPException

from app.schemas import (
    IncidentDetail,
    IncidentResolveRequest,
    IncidentResolveResponse,
    IncidentSummary,
)
from app.services.transaction_service import txn_store

router = APIRouter(prefix="/incidents", tags=["incidents"])


@router.get("", response_model=list[IncidentSummary])
def list_incidents() -> list[IncidentSummary]:
    return txn_store.list_incidents()


@router.get("/{incident_id}", response_model=IncidentDetail)
def get_incident(incident_id: str) -> IncidentDetail:
    inc = txn_store.get_incident(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc


@router.post("/{incident_id}/resolve", response_model=IncidentResolveResponse)
def resolve_incident(incident_id: str, body: IncidentResolveRequest) -> IncidentResolveResponse:
    inc = txn_store.resolve_incident(incident_id, action=body.action, notes=body.notes)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return IncidentResolveResponse(incidentId=inc.incidentId, status=inc.status)
