# SecureWealth Twin — Backend

Hackathon prototype. FastAPI, in-memory, deterministic, demo-safe.
Mirrors the TypeScript types in `frontend/src/data/mockData.ts` exactly.

## Run it

```bash
cd backend
python3 -m venv venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Interactive OpenAPI docs: <http://localhost:8000/docs>
Health: <http://localhost:8000/health>

## Connect the frontend

1. Copy `backend/integration/api.ts` to `frontend/src/data/api.ts`.
2. In `frontend/`, create a `.env` file:

   ```
   VITE_API_BASE=http://localhost:8000
   ```

3. Replace mockData imports screen-by-screen (see map below).

That's it. No frontend refactor required — `api.ts` re-exports the same types,
so existing components keep type-checking.

## Architecture

```
backend/
├── main.py                      # FastAPI app + CORS + router wiring
├── requirements.txt
├── README.md
├── integration/
│   └── api.ts                   # Drop-in client for the frontend
└── app/
    ├── schemas.py               # Pydantic models (mirror mockData.ts types)
    ├── data/
    │   ├── profiles.py          # PROFILES constant
    │   ├── scenarios.py         # SCENARIOS constant
    │   ├── audit.py             # AUDIT_TIMELINE + AUDIT_SIGNALS constants
    │   └── chat.py              # INITIAL_CHAT + canned-reply library
    ├── services/                # Business logic — one file per concern
    │   ├── audit_service.py     # Append-only audit log (in-memory, thread-safe)
    │   ├── fraud_service.py     # Rule-based scoring → ALLOW | WARN | BLOCK
    │   ├── transaction_service.py  # Persists txns + opens incidents on WARN/BLOCK
    │   ├── guardian_service.py  # Guardian add / list / revoke
    │   └── chat_service.py      # Keyword-matched canned replies + per-profile history
    └── routers/                 # HTTP layer — thin wrappers over services
        ├── auth.py
        ├── profiles.py
        ├── insights.py
        ├── security.py
        ├── transactions.py
        ├── incidents.py
        ├── guardians.py
        ├── chat.py
        └── audit.py
```

### Why this structure

- Routers are thin: swapping in a real DB later means touching **only** `services/` and `data/`.
- Rules (fraud thresholds, canned replies) live in single files — easy to tune during a live demo.
- Pydantic schemas are the contract. Change a field here, the frontend type in
  `api.ts` needs to match — keeping drift obvious.

## Fraud engine cheat sheet

Rules in `app/services/fraud_service.py`, points are additive, score is clamped 0–100:

| Signal                                         | Points |
| ---------------------------------------------- | ------ |
| Amount ≥ ₹2,00,000                             | 35     |
| Amount ≥ ₹50,000 (but < ₹2,00,000)             | 20     |
| New device                                     | 25     |
| New recipient                                  | 20     |
| Paste detected (account number pasted, typed)  | 15     |
| Hover on confirm > 3 s                         | 10     |

Decision bands: `<40 → ALLOW`, `40–69 → WARN`, `≥70 → BLOCK`.

Pure function, deterministic. Same input → same output.

## Screen → Endpoint map

| Screen                     | Purpose                              | Endpoints                                                                                           |
| -------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `LoginScreen.tsx`          | Login                                | `POST /auth/login`                                                                                  |
| `OTPScreen.tsx`            | OTP verify                           | `POST /auth/verify-otp`                                                                             |
| `HomeTab.tsx`              | Dashboard                            | `GET /profiles/{key}`, `GET /insights/{key}/summary`, `GET /insights/{key}/leaks`                    |
| `InsightsTab.tsx`          | Scenarios + personalized recs        | `GET /scenarios`, `GET /insights/{key}/life-event`, `GET /insights/{key}/leaks`                      |
| `SecurityTab.tsx`          | Security summary + alerts            | `GET /security/{key}`, `GET /security/audit/timeline`, `GET /security/audit/signals`                |
| `LifeEventsDetail.tsx`     | Life-event detail                    | `GET /insights/{key}/life-event`                                                                    |
| `FraudAlert.tsx`           | Fraud hold screen                    | `GET /incidents/{id}`, `POST /incidents/{id}/resolve`                                                |
| `AIAdvisor.tsx`            | Chat                                 | `GET /chat/initial`, `GET /chat/{key}`, `POST /chat`                                                 |
| `GuardianSetup.tsx`        | Add guardian                         | `POST /guardians`                                                                                   |
| `OfficerView.tsx`          | Officer incident review              | `GET /incidents`, `GET /incidents/{id}`, `POST /incidents/{id}/resolve`                              |
| `MoreTab.tsx`              | Profile switcher + settings          | `GET /profiles` (optional — Zustand can stay client-side)                                            |
| (new) Transfer / Pay flow  | **Transaction submit → risk → UI**   | `POST /transactions/evaluate` (live), `POST /transactions` (commit) → navigate to `FraudAlert` on `decision != ALLOW` |

## The critical flow (Transaction → Risk → Decision → UI)

```
User fills transfer form
   │
   │  (optionally) while typing
   ▼
POST /transactions/evaluate   ← live preview, no persistence
   │
   ▼
User taps Confirm
   │
   ▼
POST /transactions            ← commits + opens incident if WARN/BLOCK
   │
   │ response.evaluation.decision
   │   ALLOW → show success toast
   │   WARN  → navigate('/fraud-alert', { state: { incidentId } })
   │   BLOCK → navigate('/fraud-alert', { state: { incidentId, blocked: true } })
   ▼
FraudAlert.tsx
   calls GET /incidents/{incidentId}
   renders timeline + signals + reasons
   user approves/cancels → POST /incidents/{incidentId}/resolve
```

## Determinism

- No randomness anywhere. Same input → same output.
- UUIDs appear in IDs but never affect decisions.
- On startup, one demo incident is seeded so `OfficerView` has data on first load.
- No I/O, no external APIs, no background tasks.

## Extending

Adding a new profile: add a key to `app/data/profiles.py` → every endpoint
picks it up automatically. Update the `ProfileKey` literal in `schemas.py`
and in `mockData.ts` to keep types tight.

Adding a new fraud rule: add a function + threshold in
`app/services/fraud_service.py`, append it to the loop in `evaluate()`.
No other file needs to change.
