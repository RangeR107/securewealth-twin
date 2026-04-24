"""
Chat seed + canned reply library for the AI Advisor.
Deterministic: given the same input, always returns the same reply.
"""
from app.schemas import ChatMessage

INITIAL_CHAT: list[ChatMessage] = [
    ChatMessage(role="user", text="Should I start a SIP right now?"),
    ChatMessage(
        role="ai",
        text="Based on your profile, yes — this is a good time to start.",
        bullets=[
            "Start ₹3,000/month in a Flexi-cap fund",
            "Add ₹2,000/month in a Liquid fund for emergencies",
            "Review after 3 months — increase by ₹500 each quarter",
        ],
        disclaimer=True,
    ),
    ChatMessage(role="user", text="Am I safe from fraud right now?"),
    ChatMessage(
        role="ai",
        text="Your security health is 81/100 — above average.",
        bullets=[
            "No suspicious sessions in last 7 days ✓",
            "Device trust: Verified ✓",
            "Stress Index: Low — thresholds are normal ✓",
        ],
        disclaimer=False,
    ),
]


# keyword → canned AI reply. First match wins; default falls through.
CANNED_REPLIES: list[tuple[list[str], ChatMessage]] = [
    (
        ["sip", "invest", "mutual fund"],
        ChatMessage(
            role="ai",
            text="Here's a SIP plan tailored to your profile.",
            bullets=[
                "Start ₹3,000/month in a Flexi-cap fund",
                "Add ₹2,000/month in a Liquid fund for emergencies",
                "Increase by ₹500 each quarter",
            ],
            disclaimer=True,
        ),
    ),
    (
        ["fraud", "safe", "secure", "security"],
        ChatMessage(
            role="ai",
            text="You're in good shape — no recent suspicious activity detected.",
            bullets=[
                "No suspicious sessions in last 7 days ✓",
                "Device trust: Verified ✓",
                "Stress Index is within normal range ✓",
            ],
            disclaimer=False,
        ),
    ),
    (
        ["tax", "80c", "elss"],
        ChatMessage(
            role="ai",
            text="You still have unused 80C headroom this year.",
            bullets=[
                "Contribute up to ₹1.5L under 80C",
                "ELSS SIP of ₹12,500/month hits the cap",
                "Lock-in is 3 years — shortest among 80C options",
            ],
            disclaimer=True,
        ),
    ),
    (
        ["insurance", "cover", "term"],
        ChatMessage(
            role="ai",
            text="Let's size your cover correctly.",
            bullets=[
                "Rule of thumb: 10–15× annual income as term cover",
                "Add critical-illness rider for ₹25L",
                "Review every 3 years or after major life events",
            ],
            disclaimer=True,
        ),
    ),
    (
        ["home", "loan", "house", "property"],
        ChatMessage(
            role="ai",
            text="Home purchase is a big lever — here's how to prepare.",
            bullets=[
                "Target 20% down payment to avoid PMI-style loading",
                "Keep EMI under 40% of take-home",
                "Lock-in rate if RBI is in a cutting cycle",
            ],
            disclaimer=True,
        ),
    ),
]


DEFAULT_REPLY = ChatMessage(
    role="ai",
    text="I've noted your question. Here's what I'd look at first.",
    bullets=[
        "Review your Wealth Leaks tab for quick wins",
        "Check the Insights tab for scenario-based advice",
        "Ask me a more specific question for a tailored plan",
    ],
    disclaimer=True,
)
