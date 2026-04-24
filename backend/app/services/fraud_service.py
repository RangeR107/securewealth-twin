"""
Rule-based fraud detection.

Inputs come from TransactionRequest. Output is a deterministic score (0–100),
a decision (ALLOW / WARN / BLOCK), and human-readable reasons.

Thresholds are tuned for demo realism, not production — they can be tweaked
in one place (RULES + DECISION_BANDS) without touching call sites.
"""
from __future__ import annotations

from typing import List, Tuple

from app.schemas import FraudDecision, FraudEvaluation, TransactionRequest

# ─── RULES ────────────────────────────────────────────────────────────────────
# Each rule: (label, points, predicate)
# Keep rules simple + independent so they're easy to explain during the demo.

HIGH_AMOUNT_THRESHOLD = 50_000      # ₹50k triggers +points
VERY_HIGH_AMOUNT_THRESHOLD = 200_000  # ₹2L triggers more points
HOVER_THRESHOLD_SEC = 3.0           # >3s hover on confirm = suspicious


def _amount_points(amount: float) -> Tuple[int, str | None]:
    if amount >= VERY_HIGH_AMOUNT_THRESHOLD:
        return 35, f"Very high amount (₹{amount:,.0f}) — unusual for this profile"
    if amount >= HIGH_AMOUNT_THRESHOLD:
        return 20, f"High amount (₹{amount:,.0f}) above safe threshold"
    return 0, None


def _new_device_points(is_new: bool) -> Tuple[int, str | None]:
    if is_new:
        return 25, "New device detected — not in trusted list"
    return 0, None


def _new_recipient_points(is_new: bool) -> Tuple[int, str | None]:
    if is_new:
        return 20, "New recipient — not in your payee history"
    return 0, None


def _paste_points(paste_detected: bool) -> Tuple[int, str | None]:
    if paste_detected:
        return 15, "Account number pasted (not typed) — social-engineering signal"
    return 0, None


def _hover_points(hover: float) -> Tuple[int, str | None]:
    if hover > HOVER_THRESHOLD_SEC:
        return 10, f"Long hesitation on confirm ({hover:.1f}s) — possible coercion"
    return 0, None


def _decision_for(score: int) -> FraudDecision:
    if score >= 70:
        return "BLOCK"
    if score >= 40:
        return "WARN"
    return "ALLOW"


def evaluate(txn: TransactionRequest) -> FraudEvaluation:
    """Pure function: same input → same output. No I/O, no randomness."""
    score = 0
    reasons: List[str] = []

    for fn, value in (
        (_amount_points, txn.amount),
        (_new_device_points, txn.deviceIsNew),
        (_new_recipient_points, txn.recipientIsNew),
        (_paste_points, txn.pasteDetected),
        (_hover_points, txn.hoverDurationSec),
    ):
        pts, reason = fn(value)  # type: ignore[arg-type]
        score += pts
        if reason:
            reasons.append(reason)

    if not reasons:
        reasons.append("No risk signals detected — transaction looks normal.")

    score = max(0, min(100, score))
    decision = _decision_for(score)

    return FraudEvaluation(
        score=score,
        decision=decision,
        reasons=reasons,
        incidentId=None,  # populated later by incident_service if decision != ALLOW
    )
