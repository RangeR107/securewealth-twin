"""
Transaction creation (the critical Transaction → Risk → Decision → UI flow).

POST /transactions/evaluate — pure scoring, no persistence. Use this to preview
    the decision while the user is typing.
POST /transactions        — persists the transaction, opens an incident on
    WARN/BLOCK, returns the full result.
GET  /transactions[?profileKey=] — list history.
"""
from fastapi import APIRouter, HTTPException, Query

from app.schemas import (
    FraudEvaluation,
    ProfileKey,
    Transaction,
    TransactionListResponse,
    TransactionRequest,
)
from app.services.fraud_service import evaluate
from app.services.transaction_service import txn_store

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post("/evaluate", response_model=FraudEvaluation)
def evaluate_txn(body: TransactionRequest) -> FraudEvaluation:
    """Preview only — doesn't persist anything. Safe to call on every keystroke."""
    return evaluate(body)


@router.post("", response_model=dict)
def submit_txn(body: TransactionRequest) -> dict:
    txn, incident = txn_store.create(body)
    return {
        "transaction": txn,
        "evaluation": {
            "score": txn.riskScore,
            "decision": txn.decision,
            "reasons": txn.reasons,
            "incidentId": txn.incidentId,
        },
        "incident": incident,
    }


@router.get("", response_model=TransactionListResponse)
def list_txns(profileKey: ProfileKey | None = Query(default=None)) -> TransactionListResponse:
    items = txn_store.list_for(profileKey)
    return TransactionListResponse(items=items, total=len(items))


@router.get("/{txn_id}", response_model=Transaction)
def get_txn(txn_id: str) -> Transaction:
    t = txn_store.get(txn_id)
    if not t:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return t
