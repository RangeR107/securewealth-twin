"""
SecureWealth Twin — demo backend.

Run:
    uvicorn main:app --reload --port 8000

Docs (interactive OpenAPI UI):
    http://localhost:8000/docs
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    audit,
    auth,
    chat,
    extras,
    guardians,
    incidents,
    insights,
    intelligence,
    profiles,
    security,
    transactions,
)

app = FastAPI(
    title="SecureWealth Twin API",
    version="0.1.0",
    description=(
        "Hackathon prototype backend. In-memory, deterministic, demo-safe. "
        "All response shapes mirror the TypeScript types in "
        "frontend/src/data/mockData.ts."
    ),
)

# CORS — allow Vite (5173), CRA (3000), and LAN dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4173",  # vite preview
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["meta"])
def health() -> dict:
    return {"ok": True, "service": "securewealth-twin-api", "version": "0.1.0"}


app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(insights.router)
app.include_router(security.router)
app.include_router(transactions.router)
app.include_router(incidents.router)
app.include_router(guardians.router)
app.include_router(chat.router)
app.include_router(audit.router)
app.include_router(intelligence.router)
app.include_router(extras.router)
