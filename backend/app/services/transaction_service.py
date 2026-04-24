"""
Transaction + incident store. In-memory, append-only.

Flow (matches frontend Transaction → Risk → Decision → UI):
  1. Frontend POSTs a TransactionRequest to /transactions
  2. fraud_service.evaluate() returns a FraudEvaluation
  3. If decision != ALLOW, an incident is created (with a copy of the default
     AUDIT_TIMELINE + AUDIT_SIGNALS, plus live reasons injected).
  4. Transaction is persisted with the resulting decision + riskScore.
  5. Response contains both the transaction and the evaluation so the frontend
     can navigate to /fraud-alert when needed.
"""
from __future__ import annotations

from datetime import datetime, timezone
from threading import Lock
from typing import List, Optional
from uuid import uuid4

from app.data.audit import AUDIT_SIGNALS, AUDIT_TIMELINE
from app.data.profiles import PROFILES
from app.schemas import (
    AuditSignal,
    FraudDecision,
    IncidentDetail,
    IncidentSummary,
    ProfileKey,
    Transaction,
    TransactionRequest,
)
from app.services.audit_service import audit_store
from app.services.fraud_service import evaluate


def _new_id(prefix: str) -> str:
    return f"{prefix}-{uuid4().hex[:10].upper()}"


class TransactionStore:
    def __init__(self) -> None:
        self._txns: dict[str, Transaction] = {}
        self._incidents: dict[str, IncidentDetail] = {}
        self._lock = Lock()

    # ── transactions ───────────────────────────────────────────────────────
    def create(self, req: TransactionRequest) -> tuple[Transaction, Optional[IncidentDetail]]:
        evaluation = evaluate(req)

        txn_id = _new_id("TXN")
        incident: Optional[IncidentDetail] = None

        status: str
        if evaluation.decision == "ALLOW":
            status = "completed"
        elif evaluation.decision == "WARN":
            status = "pending_review"
        else:
            status = "blocked"

        if evaluation.decision != "ALLOW":
            incident = self._open_incident(req, evaluation.score, evaluation.decision, evaluation.reasons)
            evaluation.incidentId = incident.incidentId

        txn = Transaction(
            id=txn_id,
            profileKey=req.profileKey,
            amount=req.amount,
            recipient=req.recipient,
            timestamp=datetime.now(timezone.utc).isoformat(),
            status=status,  # type: ignore[arg-type]
            decision=evaluation.decision,
            riskScore=evaluation.score,
            reasons=evaluation.reasons,
            incidentId=evaluation.incidentId,
        )

        with self._lock:
            self._txns[txn_id] = txn

        # write audit log entries for the demo audit trail
        audit_store.log(
            event="txn_attempt",
            profile_key=req.profileKey,
            details={"txnId": txn_id, "amount": req.amount, "recipient": req.recipient},
        )
        audit_store.log(
            event="risk_score",
            profile_key=req.profileKey,
            details={"txnId": txn_id, "score": evaluation.score, "decision": evaluation.decision},
        )
        return txn, incident

    def list_for(self, profile_key: Optional[ProfileKey] = None) -> List[Transaction]:
        items = list(self._txns.values())
        if profile_key is not None:
            items = [t for t in items if t.profileKey == profile_key]
        return sorted(items, key=lambda t: t.timestamp, reverse=True)

    def get(self, txn_id: str) -> Optional[Transaction]:
        return self._txns.get(txn_id)

    # ── incidents ──────────────────────────────────────────────────────────
    def _open_incident(
        self,
        req: TransactionRequest,
        score: int,
        decision: FraudDecision,
        reasons: List[str],
    ) -> IncidentDetail:
        incident_id = _new_id("INC")
        profile = PROFILES[req.profileKey]

        # use the curated demo timeline/signals as the baseline, but inject live
        # score + reasons so the officer view reflects this specific transaction
        signals = [AuditSignal(**s.model_dump()) for s in AUDIT_SIGNALS]
        for s in signals:
            if s.key == "risk_score":
                s.value = f"{score} / 100"
                s.flagged = score >= 40

        persona = (
            "Social Engineering"
            if req.pasteDetected or req.hoverDurationSec > 3.0
            else ("New Device" if req.deviceIsNew else "Anomalous Amount")
        )

        incident = IncidentDetail(
            incidentId=incident_id,
            profileKey=req.profileKey,
            userName=profile.name,
            amount=req.amount,
            timestamp=datetime.now(timezone.utc).isoformat(),
            riskScore=score,
            decision=decision,
            fraudPersona=persona,
            status="open",
            timeline=[t.model_copy() for t in AUDIT_TIMELINE],
            signals=signals,
            reasons=reasons,
        )
        with self._lock:
            self._incidents[incident_id] = incident
        return incident

    def list_incidents(self) -> List[IncidentSummary]:
        return sorted(
            (IncidentSummary(**i.model_dump()) for i in self._incidents.values()),
            key=lambda i: i.timestamp,
            reverse=True,
        )

    def get_incident(self, incident_id: str) -> Optional[IncidentDetail]:
        return self._incidents.get(incident_id)

    def resolve_incident(
        self,
        incident_id: str,
        action: str = "resolve",
        notes: Optional[str] = None,
    ) -> Optional[IncidentDetail]:
        inc = self._incidents.get(incident_id)
        if not inc:
            return None
        inc.status = "resolved" if action == "resolve" else ("escalated" if action == "escalate" else "resolved")
        audit_store.log(
            event="incident_resolved",
            profile_key=inc.profileKey,
            details={"incidentId": incident_id, "action": action, "notes": notes},
        )
        return inc


txn_store = TransactionStore()


# ─── seed one demo incident so /incidents list isn't empty on first load ─────
def _seed_demo_incident() -> None:
    """
    Seed a single demo incident matching the hardcoded one shown in OfficerView
    (Priya, ₹85K). Does nothing on subsequent calls.
    """
    if txn_store._incidents:
        return
    txn_store.create(
        TransactionRequest(
            profileKey="priya",
            amount=85_000,
            recipient="UNKNOWN_UPI@ybl",
            recipientIsNew=True,
            deviceId="device-default",
            deviceIsNew=False,
            pasteDetected=True,
            hoverDurationSec=8.3,
            location="Bangalore, IN",
            note="Demo seed — matches hardcoded OfficerView incident",
        )
    )


_seed_demo_incident()
