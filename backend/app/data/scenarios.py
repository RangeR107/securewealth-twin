"""
SCENARIOS — mirrors mockData.ts :: SCENARIOS.
"""
from app.schemas import Scenario

SCENARIOS: dict[str, Scenario] = {
    "normal": Scenario(
        label="Normal",
        color="#16A34A",
        bg="#F0FDF4",
        inflation="5.1%",
        rbi="6.5%",
        equity="Bullish",
        recs=[
            {"icon": "📈", "title": "Continue your SIP", "desc": "Markets stable — stay the course with ₹5,000/month SIP", "cta": "Manage SIP"},
            {"icon": "🏦", "title": "FD rates attractive", "desc": "Lock ₹30,000 in 1-year FD at 7.2% before rate changes", "cta": "Book FD"},
            {"icon": "🛡️", "title": "Review insurance", "desc": "Low-inflation window — best time to review term cover", "cta": "Check Coverage"},
        ],
    ),
    "inflation": Scenario(
        label="High Inflation",
        color="#D97706",
        bg="#FFFBEB",
        inflation="7.8%",
        rbi="6.75%",
        equity="Cautious",
        recs=[
            {"icon": "💧", "title": "Shift to Liquid Funds", "desc": "Move ₹20,000 from FD to liquid fund to beat inflation", "cta": "Act Now"},
            {"icon": "🥇", "title": "Gold allocation", "desc": "Add 10% gold ETF as inflation hedge — ₹8,500 suggested", "cta": "Buy Gold ETF"},
            {"icon": "✂️", "title": "Trim discretionary", "desc": "Cut non-essential spending by ₹3,000/month this quarter", "cta": "Review Budget"},
        ],
    ),
    "ratecut": Scenario(
        label="Rate Cut",
        color="#4338CA",
        bg="#EEF2FF",
        inflation="4.2%",
        rbi="5.75%",
        equity="Strong Bull",
        recs=[
            {"icon": "📊", "title": "Increase equity SIP", "desc": "Rate cuts drive rally — increase SIP to ₹8,000/month", "cta": "Increase SIP"},
            {"icon": "🏠", "title": "Home loan window", "desc": "Rates dropping — best time to apply for ₹40L loan", "cta": "Check Eligibility"},
            {"icon": "🔄", "title": "Refinance EMIs", "desc": "Renegotiate existing loans — save ₹2,100/month", "cta": "Refinance Now"},
        ],
    ),
}
