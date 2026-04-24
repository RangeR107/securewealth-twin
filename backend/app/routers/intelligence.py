"""
/intelligence — premium mock-driven intelligence endpoints.

  GET  /intelligence/{profile_key}/financial-pulse
  GET  /intelligence/{profile_key}/affordability?amount=
  GET  /intelligence/{profile_key}/peer-benchmark
  GET  /intelligence/{profile_key}/top-recommendation
  GET  /intelligence/{profile_key}/transactions
  POST /intelligence/trust-check
"""
from fastapi import APIRouter, HTTPException, Query

from app.data.profiles import PROFILES
from app.schemas import (
    AffordabilityResponse,
    FinancialPulse,
    PeerBenchmark,
    ProfileKey,
    Recommendation,
    TransactionNarrativeList,
    TrustCheckRequest,
    TrustCheckResponse,
)
from app.services import intelligence_service as svc

router = APIRouter(prefix="/intelligence", tags=["intelligence"])


def _assert_profile(profile_key: str) -> None:
    if profile_key not in PROFILES:
        raise HTTPException(status_code=404, detail="Unknown profile")


@router.get("/{profile_key}/financial-pulse", response_model=FinancialPulse)
def get_financial_pulse(profile_key: ProfileKey) -> FinancialPulse:
    _assert_profile(profile_key)
    return svc.financial_pulse(profile_key)


@router.get("/{profile_key}/affordability", response_model=AffordabilityResponse)
def get_affordability(
    profile_key: ProfileKey,
    amount: float | None = Query(default=None, ge=0),
) -> AffordabilityResponse:
    _assert_profile(profile_key)
    return svc.affordability(profile_key, amount)


@router.get("/{profile_key}/peer-benchmark", response_model=PeerBenchmark)
def get_peer_benchmark(profile_key: ProfileKey) -> PeerBenchmark:
    _assert_profile(profile_key)
    return svc.peer_benchmark(profile_key)


@router.get("/{profile_key}/top-recommendation", response_model=Recommendation)
def get_top_recommendation(profile_key: ProfileKey) -> Recommendation:
    _assert_profile(profile_key)
    return svc.top_recommendation(profile_key)


@router.get("/{profile_key}/transactions", response_model=TransactionNarrativeList)
def get_narrated_transactions(
    profile_key: ProfileKey,
    limit: int = Query(default=12, ge=1, le=50),
) -> TransactionNarrativeList:
    _assert_profile(profile_key)
    items = svc.transaction_narratives(profile_key, limit=limit)
    return TransactionNarrativeList(items=items, total=len(items))


@router.post("/trust-check", response_model=TrustCheckResponse)
def post_trust_check(body: TrustCheckRequest) -> TrustCheckResponse:
    _assert_profile(body.profileKey)
    return svc.trust_check(body.profileKey, body.recipient)
