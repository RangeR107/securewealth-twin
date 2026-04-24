"""
AUDIT_TIMELINE + AUDIT_SIGNALS — mirrors mockData.ts.
Used as the default 'demo incident' shown in SecurityTab / OfficerView / FraudAlert
when no live incident is supplied.
"""
from app.schemas import AuditSignal, AuditTimelineNode

AUDIT_TIMELINE: list[AuditTimelineNode] = [
    AuditTimelineNode(label="Login", time="11:42 PM", status="normal"),
    AuditTimelineNode(label="Navigate", time="11:43 PM", status="normal"),
    AuditTimelineNode(label="Amount\nEntered", time="11:44 PM", status="normal"),
    AuditTimelineNode(label="Paste\nDetected", time="11:44 PM", status="flagged"),
    AuditTimelineNode(label="Hover\n8.3s", time="11:45 PM", status="flagged"),
    AuditTimelineNode(label="Txn Held", time="11:45 PM", status="held"),
]

AUDIT_SIGNALS: list[AuditSignal] = [
    AuditSignal(key="paste_detected", value="TRUE ⚠️", flagged=True),
    AuditSignal(key="hover_duration", value="8.3s (threshold: 3s)", flagged=True),
    AuditSignal(key="risk_score", value="74 / 100", flagged=True),
    AuditSignal(key="fraud_persona", value="Social Engineering", flagged=True),
    AuditSignal(key="stress_index", value="32 / 100 (Low)", flagged=False),
    AuditSignal(key="z_score_deviation", value="2.8σ above baseline", flagged=True),
]
