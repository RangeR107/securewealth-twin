"""
Demo-safe seed data for KYC, notifications, compliance documents and help FAQs.
All in-memory, deterministic.
"""
from __future__ import annotations

from app.schemas import ComplianceDoc, HelpFaq, KycStatus, NotificationItem


KYC: dict[str, KycStatus] = {
    "priya": KycStatus(
        profileKey="priya",
        status="verified",
        level="Full KYC",
        panLinked=True,
        aadhaarLinked=True,
        lastVerified="12 Jan 2026",
        expiresOn="12 Jan 2031",
        documents=[
            {"name": "PAN Card",         "status": "verified", "date": "12 Jan 2026"},
            {"name": "Aadhaar eKYC",     "status": "verified", "date": "12 Jan 2026"},
            {"name": "Signature Sample", "status": "verified", "date": "12 Jan 2026"},
            {"name": "Video KYC",        "status": "verified", "date": "18 Feb 2026"},
        ],
    ),
    "ramesh": KycStatus(
        profileKey="ramesh",
        status="verified",
        level="Full KYC",
        panLinked=True,
        aadhaarLinked=True,
        lastVerified="02 Nov 2025",
        expiresOn="02 Nov 2030",
        documents=[
            {"name": "PAN Card",         "status": "verified",         "date": "02 Nov 2025"},
            {"name": "Aadhaar eKYC",     "status": "verified",         "date": "02 Nov 2025"},
            {"name": "Income Proof",     "status": "verified",         "date": "20 Dec 2025"},
            {"name": "Address Proof",    "status": "action_required",  "date": "—"},
        ],
    ),
    "sme": KycStatus(
        profileKey="sme",
        status="pending",
        level="Video KYC",
        panLinked=True,
        aadhaarLinked=False,
        lastVerified="08 Mar 2026",
        expiresOn="08 Mar 2031",
        documents=[
            {"name": "Business PAN",    "status": "verified",        "date": "08 Mar 2026"},
            {"name": "GST Certificate", "status": "verified",        "date": "08 Mar 2026"},
            {"name": "Shop Licence",    "status": "pending",         "date": "—"},
            {"name": "Director KYC",    "status": "action_required", "date": "—"},
        ],
    ),
}


NOTIFICATIONS: dict[str, list[NotificationItem]] = {
    "priya": [
        NotificationItem(
            id="n1",
            type="security",
            title="New login from Mumbai",
            body="iPhone 14 · Jio 5G. If this wasn't you, tap to review.",
            timestamp="2026-04-24T09:12:00+05:30",
            read=False,
            severity="warning",
            icon="🔐",
        ),
        NotificationItem(
            id="n2",
            type="insight",
            title="₹45K idle savings detected",
            body="Move to a liquid fund and earn up to ₹2,300/yr extra.",
            timestamp="2026-04-23T18:00:00+05:30",
            read=False,
            severity="info",
            icon="💡",
        ),
        NotificationItem(
            id="n3",
            type="transaction",
            title="Swiggy · ₹420",
            body="Debited from A/C **4821. Your 8th Swiggy order this month.",
            timestamp="2026-04-23T21:10:00+05:30",
            read=True,
            severity="info",
            icon="🍔",
        ),
        NotificationItem(
            id="n4",
            type="guardian",
            title="Guardian request pending",
            body="Aditya Kumar hasn't accepted yet. Expires in 36 hours.",
            timestamp="2026-04-22T14:22:00+05:30",
            read=True,
            severity="info",
            icon="🛡️",
        ),
        NotificationItem(
            id="n5",
            type="system",
            title="App updated to v2.4",
            body="New: Invisible Security Indicator and Affordability Pulse.",
            timestamp="2026-04-21T11:00:00+05:30",
            read=True,
            severity="info",
            icon="✨",
        ),
    ],
    "ramesh": [
        NotificationItem(
            id="n1",
            type="insight",
            title="Term cover below family need",
            body="Recommended cover: ₹1.2 Cr. Current: ₹45L.",
            timestamp="2026-04-24T08:30:00+05:30",
            read=False,
            severity="warning",
            icon="🛡️",
        ),
        NotificationItem(
            id="n2",
            type="transaction",
            title="EMI auto-debited · ₹35,000",
            body="Home loan EMI cleared. Next due: 20 May 2026.",
            timestamp="2026-04-20T10:00:00+05:30",
            read=True,
            severity="info",
            icon="🏠",
        ),
        NotificationItem(
            id="n3",
            type="security",
            title="Password changed",
            body="From a known device in Pune. Dismiss if this was you.",
            timestamp="2026-04-18T19:44:00+05:30",
            read=True,
            severity="info",
            icon="🔐",
        ),
    ],
    "sme": [
        NotificationItem(
            id="n1",
            type="insight",
            title="₹4.8L surplus sitting idle",
            body="Park in a sweep FD and earn ~₹26K/yr.",
            timestamp="2026-04-24T07:55:00+05:30",
            read=False,
            severity="warning",
            icon="💰",
        ),
        NotificationItem(
            id="n2",
            type="transaction",
            title="GST debit · ₹48,500",
            body="Paid to CBDT. Receipt available in Compliance.",
            timestamp="2026-04-23T11:15:00+05:30",
            read=False,
            severity="info",
            icon="🧾",
        ),
        NotificationItem(
            id="n3",
            type="system",
            title="KYC document pending",
            body="Upload shop licence to complete Video KYC.",
            timestamp="2026-04-22T16:04:00+05:30",
            read=True,
            severity="critical",
            icon="📝",
        ),
    ],
}


COMPLIANCE_DOCS: list[ComplianceDoc] = [
    ComplianceDoc(
        id="c1",
        title="DPDP Act 2023 — User Rights Summary",
        category="regulation",
        issuedBy="MeitY, Government of India",
        date="11 Aug 2023",
        fileSize="312 KB",
        summary="Digital Personal Data Protection Act rights, consent, and grievance redressal.",
    ),
    ComplianceDoc(
        id="c2",
        title="RBI Master Direction on Digital Payment Security",
        category="regulation",
        issuedBy="Reserve Bank of India",
        date="18 Feb 2021",
        fileSize="1.4 MB",
        summary="Security controls for mobile banking apps, device binding, and fraud monitoring.",
    ),
    ComplianceDoc(
        id="c3",
        title="Punjab & Sind Bank — Privacy Policy",
        category="policy",
        issuedBy="Punjab & Sind Bank",
        date="01 Apr 2026",
        fileSize="218 KB",
        summary="How we collect, process and share your personal and financial data.",
    ),
    ComplianceDoc(
        id="c4",
        title="Monthly Transaction Statement — Mar 2026",
        category="statement",
        issuedBy="Punjab & Sind Bank",
        date="01 Apr 2026",
        fileSize="94 KB",
        summary="Signed PDF of all transactions in the previous calendar month.",
    ),
    ComplianceDoc(
        id="c5",
        title="Fraud Hold Report — Incident #INC-2026-00847",
        category="report",
        issuedBy="SecureWealth Twin",
        date="22 Apr 2026",
        fileSize="47 KB",
        summary="Forensic timeline, signals and analyst disposition for the held transaction.",
    ),
    ComplianceDoc(
        id="c6",
        title="Grievance Redressal Policy",
        category="policy",
        issuedBy="Punjab & Sind Bank",
        date="01 Jan 2026",
        fileSize="128 KB",
        summary="SLA, escalation matrix and Banking Ombudsman contact for unresolved issues.",
    ),
]


HELP_FAQS: list[HelpFaq] = [
    HelpFaq(
        id="f1",
        question="What is the Financial Pulse score?",
        answer=(
            "A single 0–100 score summarising your wealth health, security posture "
            "and resilience. It updates daily based on balances, spending patterns "
            "and any security signals."
        ),
        category="Intelligence",
    ),
    HelpFaq(
        id="f2",
        question="Why was my transaction paused?",
        answer=(
            "We run every transfer through a rule-based risk engine that looks at "
            "amount, device, recipient novelty and behavioural cues like paste or "
            "long hover. If the score crosses the warn band, we apply a cool-off."
        ),
        category="Security",
    ),
    HelpFaq(
        id="f3",
        question="What does the 🟢🟡🔴 recipient dot mean?",
        answer=(
            "🟢 Trusted contact you've paid before. 🟡 New recipient — we'll keep an "
            "extra eye on the transfer. 🔴 Flagged — multiple users have reported "
            "this handle as risky."
        ),
        category="Security",
    ),
    HelpFaq(
        id="f4",
        question="How does Guardian Mode work?",
        answer=(
            "A trusted contact gets alerts only — never balances or amounts. They "
            "cannot approve or cancel transactions. DPDP 2023 consent is required "
            "and you can revoke anytime."
        ),
        category="Guardian",
    ),
    HelpFaq(
        id="f5",
        question="Is my data shared with anyone?",
        answer=(
            "No. Processing happens inside your device-bound session. Analysts may "
            "review anonymised signals only when a transaction is held, as per RBI "
            "DBS.FrMC.BC.No.1/23.04.001/2023."
        ),
        category="Privacy",
    ),
    HelpFaq(
        id="f6",
        question="How is 'Safe to Spend' calculated?",
        answer=(
            "Monthly income minus committed expenses (rent, EMIs, subscriptions) "
            "minus allocation to active goals. It's a steer, not a hard limit."
        ),
        category="Intelligence",
    ),
    HelpFaq(
        id="f7",
        question="What happens if I lose my phone?",
        answer=(
            "Call 1800-419-8300 or tap 'Lock Account' from any browser. Device "
            "binding ensures the stolen phone can't authorise payments without "
            "biometrics."
        ),
        category="Security",
    ),
    HelpFaq(
        id="f8",
        question="Do I need to re-KYC every year?",
        answer=(
            "No. Full KYC is valid for 5 years unless your address or identity "
            "changes. You'll get a reminder 60 days before expiry."
        ),
        category="Compliance",
    ),
]
