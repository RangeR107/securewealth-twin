"""
Seeded transaction history per profile — used for Transaction Narrative
Intelligence (Capital One style) and Recent Transactions preview on the Home tab.

Deterministic and demo-safe. No real data, no real API, no DB.
"""
from __future__ import annotations

# Each entry: (id_suffix, merchant, category, amount, daysAgo, hourLocal, emoji)
# Narratives are generated at read-time in intelligence_service.py.

RAW_TRANSACTIONS: dict[str, list[dict]] = {
    "priya": [
        {"id": "t1",  "merchant": "Swiggy",         "category": "Food delivery", "amount": 420,   "daysAgo": 0,  "hour": 21, "emoji": "🍔"},
        {"id": "t2",  "merchant": "Uber",           "category": "Ride",          "amount": 235,   "daysAgo": 0,  "hour": 10, "emoji": "🚖"},
        {"id": "t3",  "merchant": "Netflix",        "category": "Subscription",  "amount": 649,   "daysAgo": 1,  "hour": 14, "emoji": "🎬"},
        {"id": "t4",  "merchant": "Amazon",         "category": "Shopping",      "amount": 1899,  "daysAgo": 2,  "hour": 19, "emoji": "📦"},
        {"id": "t5",  "merchant": "Zomato",         "category": "Food delivery", "amount": 380,   "daysAgo": 3,  "hour": 22, "emoji": "🍕"},
        {"id": "t6",  "merchant": "BigBasket",      "category": "Groceries",     "amount": 2240,  "daysAgo": 4,  "hour": 11, "emoji": "🛒"},
        {"id": "t7",  "merchant": "Swiggy",         "category": "Food delivery", "amount": 510,   "daysAgo": 5,  "hour": 13, "emoji": "🍱"},
        {"id": "t8",  "merchant": "Spotify",        "category": "Subscription",  "amount": 119,   "daysAgo": 6,  "hour": 9,  "emoji": "🎵"},
        {"id": "t9",  "merchant": "Salary Credit",  "category": "Income",        "amount": -85000,"daysAgo": 7,  "hour": 10, "emoji": "💰"},
        {"id": "t10", "merchant": "Swiggy",         "category": "Food delivery", "amount": 295,   "daysAgo": 8,  "hour": 20, "emoji": "🥡"},
        {"id": "t11", "merchant": "Rent",           "category": "Housing",       "amount": 18000, "daysAgo": 10, "hour": 9,  "emoji": "🏠"},
        {"id": "t12", "merchant": "Swiggy",         "category": "Food delivery", "amount": 645,   "daysAgo": 11, "hour": 21, "emoji": "🌮"},
        {"id": "t13", "merchant": "Ola",            "category": "Ride",          "amount": 189,   "daysAgo": 12, "hour": 18, "emoji": "🚗"},
        {"id": "t14", "merchant": "Swiggy",         "category": "Food delivery", "amount": 480,   "daysAgo": 14, "hour": 13, "emoji": "🍜"},
        {"id": "t15", "merchant": "Swiggy",         "category": "Food delivery", "amount": 550,   "daysAgo": 16, "hour": 22, "emoji": "🍗"},
        {"id": "t16", "merchant": "HotStar",        "category": "Subscription",  "amount": 299,   "daysAgo": 18, "hour": 15, "emoji": "📺"},
        {"id": "t17", "merchant": "Swiggy",         "category": "Food delivery", "amount": 390,   "daysAgo": 20, "hour": 20, "emoji": "🥗"},
        {"id": "t18", "merchant": "Uber",           "category": "Ride",          "amount": 278,   "daysAgo": 22, "hour": 8,  "emoji": "🚖"},
    ],
    "ramesh": [
        {"id": "t1",  "merchant": "HDFC Life",       "category": "Insurance",   "amount": 12500, "daysAgo": 1,  "hour": 10, "emoji": "🛡️"},
        {"id": "t2",  "merchant": "LIC Premium",     "category": "Insurance",   "amount": 8400,  "daysAgo": 2,  "hour": 11, "emoji": "📜"},
        {"id": "t3",  "merchant": "Big Bazaar",      "category": "Groceries",   "amount": 3850,  "daysAgo": 3,  "hour": 18, "emoji": "🛒"},
        {"id": "t4",  "merchant": "School Fees",     "category": "Education",   "amount": 25000, "daysAgo": 5,  "hour": 9,  "emoji": "🎓"},
        {"id": "t5",  "merchant": "HPCL Fuel",       "category": "Transport",   "amount": 2800,  "daysAgo": 6,  "hour": 19, "emoji": "⛽"},
        {"id": "t6",  "merchant": "Apollo Pharmacy", "category": "Healthcare",  "amount": 1240,  "daysAgo": 7,  "hour": 20, "emoji": "💊"},
        {"id": "t7",  "merchant": "Salary Credit",   "category": "Income",      "amount": -140000, "daysAgo": 8, "hour": 10, "emoji": "💰"},
        {"id": "t8",  "merchant": "EMI — Home Loan", "category": "EMI",         "amount": 35000, "daysAgo": 8,  "hour": 11, "emoji": "🏠"},
        {"id": "t9",  "merchant": "Tata Sky",        "category": "Subscription","amount": 549,   "daysAgo": 9,  "hour": 15, "emoji": "📺"},
        {"id": "t10", "merchant": "Big Bazaar",      "category": "Groceries",   "amount": 4200,  "daysAgo": 11, "hour": 17, "emoji": "🛒"},
        {"id": "t11", "merchant": "EMI — Car Loan",  "category": "EMI",         "amount": 18500, "daysAgo": 12, "hour": 9,  "emoji": "🚗"},
        {"id": "t12", "merchant": "Electricity",     "category": "Utility",     "amount": 3120,  "daysAgo": 13, "hour": 14, "emoji": "💡"},
        {"id": "t13", "merchant": "Jio Postpaid",    "category": "Utility",     "amount": 999,   "daysAgo": 15, "hour": 12, "emoji": "📱"},
        {"id": "t14", "merchant": "HDFC MF SIP",     "category": "Investment",  "amount": 5000,  "daysAgo": 16, "hour": 10, "emoji": "📈"},
        {"id": "t15", "merchant": "Apollo Pharmacy", "category": "Healthcare",  "amount": 890,   "daysAgo": 18, "hour": 19, "emoji": "💊"},
    ],
    "sme": [
        {"id": "t1",  "merchant": "GST Payment",      "category": "Tax",         "amount": 48500, "daysAgo": 1,  "hour": 11, "emoji": "🧾"},
        {"id": "t2",  "merchant": "Supplier — Cotton","category": "Inventory",   "amount": 125000,"daysAgo": 2,  "hour": 14, "emoji": "📦"},
        {"id": "t3",  "merchant": "Salaries — Staff", "category": "Payroll",     "amount": 95000, "daysAgo": 3,  "hour": 10, "emoji": "👥"},
        {"id": "t4",  "merchant": "Rent — Shop",      "category": "Rent",        "amount": 35000, "daysAgo": 4,  "hour": 9,  "emoji": "🏪"},
        {"id": "t5",  "merchant": "Supplier — Dyes",  "category": "Inventory",   "amount": 22400, "daysAgo": 5,  "hour": 15, "emoji": "🎨"},
        {"id": "t6",  "merchant": "Razorpay Settlement","category": "Income",    "amount": -320000, "daysAgo": 6, "hour": 10, "emoji": "💰"},
        {"id": "t7",  "merchant": "Electricity — Shop","category": "Utility",    "amount": 7820,  "daysAgo": 7,  "hour": 17, "emoji": "💡"},
        {"id": "t8",  "merchant": "GST Input Claim",  "category": "Tax",         "amount": 18600, "daysAgo": 9,  "hour": 12, "emoji": "🧾"},
        {"id": "t9",  "merchant": "Supplier — Packaging","category": "Inventory","amount": 14200, "daysAgo": 11, "hour": 13, "emoji": "📦"},
        {"id": "t10", "merchant": "Internet — Act Fibre","category": "Utility",  "amount": 1499,  "daysAgo": 13, "hour": 14, "emoji": "🌐"},
        {"id": "t11", "merchant": "Audit Fees — CA",  "category": "Professional","amount": 15000, "daysAgo": 15, "hour": 16, "emoji": "📊"},
        {"id": "t12", "merchant": "Advance — Supplier","category": "Inventory",  "amount": 40000, "daysAgo": 17, "hour": 11, "emoji": "📦"},
    ],
}


# Trusted recipient whitelist per profile — drives the Trust Check indicator.
# Known → green, anything listed in SUSPICIOUS → red, otherwise → yellow (new).
TRUSTED_RECIPIENTS: dict[str, list[str]] = {
    "priya": [
        "mom", "mother", "priya mom", "aditya kumar", "aditya", "roommate",
        "landlord rent", "swiggy", "zomato", "amazon", "netflix", "spotify",
        "9876543210",  # demo trusted UPI id
    ],
    "ramesh": [
        "lakshmi iyer", "lakshmi", "wife", "hdfc life", "lic", "school fees",
        "apollo pharmacy", "big bazaar", "hpcl", "home loan emi", "car loan emi",
        "hdfc mf sip",
    ],
    "sme": [
        "supplier cotton", "supplier dyes", "supplier packaging", "gst",
        "staff payroll", "shop rent", "audit fees ca", "razorpay",
    ],
}

# Recipients that should trigger the red "flagged" indicator for demo.
SUSPICIOUS_RECIPIENTS: set[str] = {
    "unknown upi",
    "quickloan@axis",
    "crypto-trader@hdfc",
    "telegram-invest",
    "fake-officer@sbi",
}
