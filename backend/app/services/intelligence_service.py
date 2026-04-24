"""
Intelligence layer — deterministic, mock-driven.

Powers the four premium features:
  1. Financial Pulse           (Cleo-style daily score)
  2. Affordability             (Monzo-style safe-to-spend)
  3. Peer Benchmark            (cohort comparison)
  4. Trust Check               (Revolut-style recipient dot)

Plus a Transaction Narrative generator (Capital One-style).

No ML. Just rules over the already-seeded PROFILES + transactions_seed.
"""
from __future__ import annotations

from collections import Counter
from datetime import datetime, timedelta, timezone
from typing import Optional

from app.data.profiles import PROFILES
from app.data.transactions_seed import (
    RAW_TRANSACTIONS,
    SUSPICIOUS_RECIPIENTS,
    TRUSTED_RECIPIENTS,
)
from app.schemas import (
    AffordabilityResponse,
    FinancialPulse,
    PeerBenchmark,
    Recommendation,
    TransactionNarrative,
    TrustCheckResponse,
)

IST = timezone(timedelta(hours=5, minutes=30))


# ─── Financial Pulse ────────────────────────────────────────────────────────

def financial_pulse(profile_key: str) -> FinancialPulse:
    p = PROFILES[profile_key]
    # Deterministic "yesterday" score derived from the profile so the delta
    # is stable across restarts but looks reactive.
    previous = max(0, min(100, p.immuneScore - 2))
    delta = p.immuneScore - previous
    trend = "up" if delta > 0 else "down" if delta < 0 else "flat"

    if p.immuneScore >= 75:
        label = "Healthy"
        headline = f"Strong pulse — you're ahead of peers by {p.immuneScore - 60} pts."
    elif p.immuneScore >= 60:
        label = "Stable"
        headline = "Solid footing with room to tidy up a couple of leaks."
    else:
        label = "Needs attention"
        headline = "Two quick fixes could push your score past 70."

    breakdown = [
        {"label": "Wealth",     "value": p.wealthHealth,    "color": "#4338CA"},
        {"label": "Security",   "value": p.securityHealth,  "color": "#16A34A"},
        {"label": "Resilience", "value": p.resilience,      "color": "#D97706"},
    ]

    return FinancialPulse(
        score=p.immuneScore,
        previousScore=previous,
        delta=delta,
        trend=trend,
        label=label,
        headline=headline,
        breakdown=breakdown,
    )


# ─── Affordability ──────────────────────────────────────────────────────────

def _income_numeric(profile_key: str) -> float:
    raw = PROFILES[profile_key].income  # e.g. "₹85,000" or "₹1,40,000" or "₹3.2L rev"
    cleaned = raw.replace("₹", "").replace(",", "").replace(" ", "").lower()
    if cleaned.endswith("rev"):
        cleaned = cleaned[:-3]
    if cleaned.endswith("l"):
        try:
            return float(cleaned[:-1]) * 100000
        except ValueError:
            return 0.0
    if cleaned.endswith("cr"):
        try:
            return float(cleaned[:-2]) * 10000000
        except ValueError:
            return 0.0
    try:
        return float(cleaned)
    except ValueError:
        return 0.0


# Rough committed-expense share per profile (rent/EMIs/essentials/subscriptions)
_EXPENSE_RATIO = {
    "priya":  0.55,
    "ramesh": 0.68,
    "sme":    0.72,
}

# Goal allocation share per profile
_GOAL_RATIO = {
    "priya":  0.12,
    "ramesh": 0.15,
    "sme":    0.08,
}


def affordability(profile_key: str, amount: Optional[float] = None) -> AffordabilityResponse:
    income = _income_numeric(profile_key)
    committed = round(income * _EXPENSE_RATIO[profile_key])
    goal_alloc = round(income * _GOAL_RATIO[profile_key])
    safe = max(0, income - committed - goal_alloc)

    if safe >= income * 0.25:
        status = "safe"
    elif safe >= income * 0.12:
        status = "stretch"
    else:
        status = "risky"

    narrative = (
        f"You have roughly ₹{int(safe):,} left to spend freely this month "
        f"after rent, bills and goal savings."
    )

    checked = None
    can_afford = None
    after = None
    if amount is not None and amount > 0:
        after = safe - amount
        can_afford = after >= 0
        checked = float(amount)
        if can_afford:
            narrative = (
                f"Yes — ₹{int(amount):,} fits. You'd still have "
                f"₹{int(after):,} free this month."
            )
        else:
            narrative = (
                f"Tight — ₹{int(amount):,} would overshoot your safe-to-spend "
                f"by ₹{int(abs(after)):,}. Consider splitting across two months."
            )

    return AffordabilityResponse(
        monthlyIncome=income,
        committedExpenses=committed,
        goalAllocation=goal_alloc,
        safeToSpend=safe,
        status=status,
        narrative=narrative,
        checkedAmount=checked,
        canAfford=can_afford,
        afterPurchase=after,
    )


# ─── Peer Benchmark ─────────────────────────────────────────────────────────

_COHORTS = {
    "priya":  ("Young Professionals, Metro", 62),
    "ramesh": ("Mid-Career Families, Tier-1", 58),
    "sme":    ("Small Businesses, Textile & Retail", 54),
}


def peer_benchmark(profile_key: str) -> PeerBenchmark:
    p = PROFILES[profile_key]
    cohort, cohort_avg = _COHORTS[profile_key]
    delta = p.immuneScore - cohort_avg
    # Map 0 delta to 50th percentile, clamp at 5 and 95.
    percentile = max(5, min(95, 50 + delta * 2))

    if delta > 5:
        narrative = f"You're ahead of {percentile}% of {cohort.split(',')[0].lower()}."
    elif delta < -5:
        narrative = f"You're behind peers by {abs(delta)} pts — two fixes can close it."
    else:
        narrative = f"You're tracking the {cohort.split(',')[0].lower()} median."

    compare_to = [
        {"metric": "Immunity Score", "you": p.immuneScore,    "peers": cohort_avg,      "better": p.immuneScore   >= cohort_avg},
        {"metric": "Wealth Health",  "you": p.wealthHealth,   "peers": cohort_avg - 3,  "better": p.wealthHealth  >= cohort_avg - 3},
        {"metric": "Security",       "you": p.securityHealth, "peers": cohort_avg + 5,  "better": p.securityHealth >= cohort_avg + 5},
        {"metric": "Stress Index",   "you": p.stressIndex,    "peers": 45,              "better": p.stressIndex   <= 45},
    ]

    return PeerBenchmark(
        profileKey=profile_key,  # type: ignore[arg-type]
        cohort=cohort,
        yourScore=p.immuneScore,
        cohortAverage=cohort_avg,
        percentile=percentile,
        narrative=narrative,
        compareTo=compare_to,
    )


# ─── Top Recommendation ─────────────────────────────────────────────────────

_SEVERITY_ORDER = {"critical": 3, "moderate": 2, "minor": 1}


def top_recommendation(profile_key: str) -> Recommendation:
    p = PROFILES[profile_key]
    leak = sorted(p.leaks, key=lambda l: _SEVERITY_ORDER[l.severity], reverse=True)[0]

    # Impact + rationale are rule-derived strings, not ML.
    impact_map = {
        "priya":  "Save ₹2,300/yr",
        "ramesh": "Save ₹18,000/yr",
        "sme":    "Earn ~₹26,000/yr",
    }
    rationale_map = {
        "critical": "Highest-impact leak detected in your profile — start here.",
        "moderate": "Meaningful gain with minimal effort.",
        "minor":    "Small win, but a clean up.",
    }

    return Recommendation(
        id=leak.id,
        severity=leak.severity,
        icon=leak.icon,
        title=leak.title,
        desc=leak.desc,
        action=leak.action,
        impact=impact_map[profile_key],
        rationale=rationale_map[leak.severity],
    )


# ─── Transaction Narratives ─────────────────────────────────────────────────

def _narrative_for(profile_key: str, tx: dict, merchant_counts: Counter, avg_for: dict) -> tuple[str, Optional[str]]:
    m = tx["merchant"]
    amt = tx["amount"]
    cat = tx["category"]

    # Income
    if amt < 0:
        return (f"Credit of ₹{abs(int(amt)):,} — {m.lower()} landed as usual.", "income")

    count_this_month = merchant_counts[m]
    avg = avg_for.get(m, amt)
    pct = (amt - avg) / max(avg, 1) * 100 if avg else 0

    # Frequent merchant
    if count_this_month >= 4 and cat == "Food delivery":
        narrative = f"{m} order — your {_ordinal(count_this_month)} this month (avg: {int(avg):,})."
        return narrative, "frequent"
    if count_this_month >= 3:
        narrative = f"Regular {m.lower()} spend — you're on track with your usual pattern."
        return narrative, "recurring"

    # Higher than usual
    if pct > 40 and count_this_month >= 2:
        narrative = f"{m} — ₹{int(amt):,} is {int(pct)}% above your usual."
        return narrative, "higher"

    # Subscription
    if cat == "Subscription":
        return (f"{m} subscription renewed — ₹{int(amt):,}/cycle.", "recurring")

    # EMI / rent / utility
    if cat in ("EMI", "Rent", "Housing", "Utility", "Tax", "Payroll"):
        return (f"{cat} · {m} — ₹{int(amt):,} cleared on schedule.", "scheduled")

    # Default
    return (f"{m} — {cat.lower()} · ₹{int(amt):,}.", None)


def _ordinal(n: int) -> str:
    suffix = "th" if 10 <= n % 100 <= 20 else {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suffix}"


def transaction_narratives(profile_key: str, limit: int = 12) -> list[TransactionNarrative]:
    raw = RAW_TRANSACTIONS.get(profile_key, [])
    if not raw:
        return []

    # Pre-compute counts per merchant (this month = last 30d) + avg amount.
    merchant_counts: Counter = Counter()
    merchant_totals: dict[str, list[float]] = {}
    for tx in raw:
        if tx["daysAgo"] <= 30 and tx["amount"] > 0:
            merchant_counts[tx["merchant"]] += 1
            merchant_totals.setdefault(tx["merchant"], []).append(tx["amount"])
    avg_for = {m: sum(v) / len(v) for m, v in merchant_totals.items()}

    now = datetime.now(IST)
    out: list[TransactionNarrative] = []
    for tx in raw[:limit]:
        when = (now - timedelta(days=tx["daysAgo"])).replace(
            hour=tx["hour"], minute=0, second=0, microsecond=0
        )
        narrative, tag = _narrative_for(profile_key, tx, merchant_counts, avg_for)
        out.append(
            TransactionNarrative(
                id=f"{profile_key}-{tx['id']}",
                merchant=tx["merchant"],
                category=tx["category"],
                amount=float(tx["amount"]),
                timestamp=when.isoformat(),
                narrative=narrative,
                tag=tag,
                emoji=tx["emoji"],
            )
        )
    return out


# ─── Trust Check (Invisible Security Indicator) ─────────────────────────────

def trust_check(profile_key: str, recipient: str) -> TrustCheckResponse:
    r_norm = (recipient or "").strip().lower()
    trusted = {t.lower() for t in TRUSTED_RECIPIENTS.get(profile_key, [])}
    suspicious = {s.lower() for s in SUSPICIOUS_RECIPIENTS}

    # Count past transactions to this merchant (demo heuristic).
    past_count = sum(
        1 for tx in RAW_TRANSACTIONS.get(profile_key, [])
        if tx["merchant"].lower() == r_norm
    )

    if r_norm in suspicious:
        return TrustCheckResponse(
            status="flagged",
            label="Flagged recipient",
            color="red",
            pastCount=0,
            lastSeen=None,
            note="Multiple users have reported this handle. Proceed only if you're sure.",
        )

    if r_norm in trusted or past_count > 0:
        last_seen = None
        if past_count > 0:
            # Pick the most recent one.
            last_tx = min(
                (tx for tx in RAW_TRANSACTIONS[profile_key] if tx["merchant"].lower() == r_norm),
                key=lambda t: t["daysAgo"],
            )
            when = (datetime.now(IST) - timedelta(days=last_tx["daysAgo"]))
            last_seen = when.strftime("%d %b %Y")
        return TrustCheckResponse(
            status="known",
            label="Trusted contact",
            color="green",
            pastCount=max(past_count, 1),
            lastSeen=last_seen,
            note="You've paid this recipient before — looks safe.",
        )

    return TrustCheckResponse(
        status="new",
        label="New recipient",
        color="yellow",
        pastCount=0,
        lastSeen=None,
        note="First time paying this recipient — we'll add extra verification.",
    )
