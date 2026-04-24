"""
Security tab endpoints:
  - risk summary (existing)
  - default audit timeline + signals (existing)
  - Session DNA (new — device, network, behavioural score)
  - Location Guard (new — home vs current location)
"""
from fastapi import APIRouter, HTTPException

from app.data.audit import AUDIT_SIGNALS, AUDIT_TIMELINE
from app.data.profiles import PROFILES
from app.schemas import (
    AuditSignal,
    AuditTimelineNode,
    LocationGuard,
    ProfileKey,
    SessionDNA,
)

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


# ─── Session DNA ─────────────────────────────────────────────────────────────

_SESSION_DNA: dict[str, SessionDNA] = {
    "priya": SessionDNA(
        deviceId="device-priya-iphone14",
        deviceLabel="iPhone 14 · iOS 17.4",
        trusted=True,
        ipMasked="49.36.xx.xx",
        network="Jio 5G",
        lastSeen="Today, 9:12 AM",
        location="Mumbai, IN",
        biometric="face",
        behaviorScore=88,
        signals=[
            AuditSignal(key="typing_rhythm",    value="consistent",   flagged=False),
            AuditSignal(key="touch_pressure",   value="normal",       flagged=False),
            AuditSignal(key="gyro_signature",   value="match",        flagged=False),
            AuditSignal(key="app_foreground",   value="12 min",       flagged=False),
        ],
    ),
    "ramesh": SessionDNA(
        deviceId="device-ramesh-oneplus",
        deviceLabel="OnePlus 11 · Android 14",
        trusted=True,
        ipMasked="103.22.xx.xx",
        network="Airtel Fiber",
        lastSeen="Today, 8:30 AM",
        location="Pune, IN",
        biometric="fingerprint",
        behaviorScore=82,
        signals=[
            AuditSignal(key="typing_rhythm",    value="consistent",   flagged=False),
            AuditSignal(key="touch_pressure",   value="normal",       flagged=False),
            AuditSignal(key="gyro_signature",   value="match",        flagged=False),
            AuditSignal(key="app_foreground",   value="6 min",        flagged=False),
        ],
    ),
    "sme": SessionDNA(
        deviceId="device-sme-samsung",
        deviceLabel="Samsung Galaxy Tab · Android 14",
        trusted=True,
        ipMasked="157.32.xx.xx",
        network="ACT Fibre",
        lastSeen="Today, 7:55 AM",
        location="Surat, IN",
        biometric="fingerprint",
        behaviorScore=74,
        signals=[
            AuditSignal(key="typing_rhythm",    value="variable",     flagged=True),
            AuditSignal(key="touch_pressure",   value="normal",       flagged=False),
            AuditSignal(key="gyro_signature",   value="match",        flagged=False),
            AuditSignal(key="app_foreground",   value="22 min",       flagged=False),
        ],
    ),
}


@router.get("/{profile_key}/session-dna", response_model=SessionDNA)
def get_session_dna(profile_key: ProfileKey) -> SessionDNA:
    if profile_key not in PROFILES:
        raise HTTPException(status_code=404, detail="Unknown profile")
    return _SESSION_DNA[profile_key]


# ─── Location Guard ──────────────────────────────────────────────────────────

_LOCATION: dict[str, LocationGuard] = {
    "priya": LocationGuard(
        homeCity="Mumbai",
        currentCity="Mumbai",
        currentCountry="India",
        safe=True,
        riskLevel="Low",
        travelMode=False,
        lastLocationChange="3 days ago",
        narrative="You're at your home location — no travel mode required.",
    ),
    "ramesh": LocationGuard(
        homeCity="Pune",
        currentCity="Pune",
        currentCountry="India",
        safe=True,
        riskLevel="Low",
        travelMode=False,
        lastLocationChange="11 days ago",
        narrative="You're at your home location — all transactions allowed.",
    ),
    "sme": LocationGuard(
        homeCity="Surat",
        currentCity="Surat",
        currentCountry="India",
        safe=True,
        riskLevel="Medium",
        travelMode=False,
        lastLocationChange="today",
        narrative="Business location active — high-value transfers need extra verification.",
    ),
}


@router.get("/{profile_key}/location", response_model=LocationGuard)
def get_location_guard(profile_key: ProfileKey) -> LocationGuard:
    if profile_key not in PROFILES:
        raise HTTPException(status_code=404, detail="Unknown profile")
    return _LOCATION[profile_key]


@router.post("/{profile_key}/location/travel-mode", response_model=LocationGuard)
def toggle_travel_mode(profile_key: ProfileKey) -> LocationGuard:
    if profile_key not in PROFILES:
        raise HTTPException(status_code=404, detail="Unknown profile")
    loc = _LOCATION[profile_key]
    loc.travelMode = not loc.travelMode
    loc.narrative = (
        "Travel mode ON — international transactions require extra verification."
        if loc.travelMode
        else "Travel mode OFF — standard home-location rules apply."
    )
    return loc
