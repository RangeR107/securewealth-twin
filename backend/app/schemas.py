"""
Pydantic schemas — match the TypeScript interfaces in frontend/src/data/mockData.ts
EXACTLY (same keys, same casing, same enum values).

If the frontend type changes, change it here too.
"""
from __future__ import annotations

from typing import List, Literal, Optional, Union

from pydantic import BaseModel, Field


# ─── TYPE ALIASES (mirror mockData.ts) ────────────────────────────────────────

ProfileKey = Literal["priya", "ramesh", "sme"]
RiskLevel = Literal["Low", "Medium", "High"]
Severity = Literal["critical", "moderate", "minor"]
ScenarioKey = Literal["normal", "inflation", "ratecut"]
AuditStatus = Literal["normal", "flagged", "held"]
FraudDecision = Literal["ALLOW", "WARN", "BLOCK"]
ChatRole = Literal["user", "ai"]


# ─── CORE DOMAIN MODELS ───────────────────────────────────────────────────────

class WealthLeak(BaseModel):
    id: int
    severity: Severity
    icon: str
    title: str
    desc: str
    action: str


class LifeEvent(BaseModel):
    type: str
    likelihood: int
    readiness: int
    gap: str
    loan: str


class UserProfile(BaseModel):
    name: str
    age: Optional[int]
    initials: str
    type: str
    income: str
    savings: str
    goals: int
    risk: str
    immuneScore: int
    wealthHealth: int
    securityHealth: int
    resilience: int
    stressIndex: int
    riskLevel: RiskLevel
    leaks: List[WealthLeak]
    event: LifeEvent
    portfolio: str
    persona: str


class ScenarioRecommendation(BaseModel):
    icon: str
    title: str
    desc: str
    cta: str


class Scenario(BaseModel):
    label: str
    color: str
    bg: str
    inflation: str
    rbi: str
    equity: str
    recs: List[ScenarioRecommendation]


class ChatMessage(BaseModel):
    role: ChatRole
    text: str
    bullets: Optional[List[str]] = None
    disclaimer: Optional[bool] = None


class AuditTimelineNode(BaseModel):
    label: str
    time: str
    status: AuditStatus


class AuditSignal(BaseModel):
    key: str
    value: str
    flagged: bool


# ─── AUTH (mock) ──────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    mobile: str
    password: str


class LoginResponse(BaseModel):
    sessionToken: str
    otpSent: bool = True
    maskedMobile: str


class OtpVerifyRequest(BaseModel):
    sessionToken: str
    otp: str


class OtpVerifyResponse(BaseModel):
    authToken: str
    profileKey: ProfileKey


# ─── TRANSACTIONS + FRAUD ────────────────────────────────────────────────────

class TransactionRequest(BaseModel):
    profileKey: ProfileKey
    amount: float
    recipient: str                       # recipient identifier / UPI / account label
    recipientIsNew: bool = False
    deviceId: str = "device-default"
    deviceIsNew: bool = False
    pasteDetected: bool = False
    hoverDurationSec: float = 0.0
    location: Optional[str] = None
    note: Optional[str] = None


class FraudEvaluation(BaseModel):
    score: int = Field(..., ge=0, le=100)
    decision: FraudDecision
    reasons: List[str]
    incidentId: Optional[str] = None     # only populated when decision != ALLOW


class Transaction(BaseModel):
    id: str
    profileKey: ProfileKey
    amount: float
    recipient: str
    timestamp: str                       # ISO-8601
    status: Literal["completed", "pending_review", "blocked", "cancelled"]
    decision: FraudDecision
    riskScore: int
    reasons: List[str] = []
    incidentId: Optional[str] = None


class TransactionListResponse(BaseModel):
    items: List[Transaction]
    total: int


# ─── AUDIT / INCIDENTS ───────────────────────────────────────────────────────

class IncidentSummary(BaseModel):
    incidentId: str
    profileKey: ProfileKey
    userName: str
    amount: float
    timestamp: str
    riskScore: int
    decision: FraudDecision
    fraudPersona: str
    status: Literal["open", "resolved", "escalated"]


class IncidentDetail(IncidentSummary):
    timeline: List[AuditTimelineNode]
    signals: List[AuditSignal]
    reasons: List[str]


class IncidentResolveRequest(BaseModel):
    notes: Optional[str] = None
    action: Literal["resolve", "escalate", "dismiss"] = "resolve"


class IncidentResolveResponse(BaseModel):
    incidentId: str
    status: Literal["open", "resolved", "escalated"]


# ─── GUARDIAN ────────────────────────────────────────────────────────────────

class GuardianRequestBody(BaseModel):
    profileKey: ProfileKey
    name: str
    phone: str
    relationship: str
    consent: bool


class Guardian(BaseModel):
    guardianId: str
    profileKey: ProfileKey
    name: str
    phone: str
    relationship: str
    status: Literal["pending", "active", "revoked", "expired"]
    createdAt: str
    expiresAt: str


# ─── CHAT ────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    profileKey: ProfileKey
    message: str


class ChatResponse(BaseModel):
    reply: ChatMessage
    history: List[ChatMessage]


# ─── AUDIT LOG (system-wide, append-only in-memory) ──────────────────────────

class AuditLogEntry(BaseModel):
    id: int
    timestamp: str
    profileKey: Optional[ProfileKey] = None
    event: str                           # e.g. "login", "otp_verified", "txn_attempt", "risk_score", "guardian_added"
    details: dict = {}


class AuditLogResponse(BaseModel):
    items: List[AuditLogEntry]
    total: int
