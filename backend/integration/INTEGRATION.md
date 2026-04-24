# Frontend Integration Guide

Step-by-step — copy/paste friendly.

## 1. Boot the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Check it: <http://localhost:8000/health> → `{"ok":true,...}`.

## 2. Install the client

Copy `backend/integration/api.ts` into the frontend:

```bash
cp backend/integration/api.ts frontend/src/data/api.ts
```

## 3. Tell the frontend where the backend is

Create `frontend/.env`:

```
VITE_API_BASE=http://localhost:8000
```

Restart Vite after creating `.env`.

## 4. Wire the screens

You don't have to migrate everything at once. Two migration paths:

### Path A — Minimal (Zustand store only)

Only change the profile store so every screen gets profile data from the API.
Zero screen edits. Good for a first demo.

**Edit `frontend/src/context/profileStore.ts`:**

```ts
import { create } from 'zustand';
import type { ProfileKey, UserProfile } from '../data/mockData';
import { PROFILES } from '../data/mockData'; // fallback
import { fetchProfiles } from '../data/api';

interface ProfileStore {
  activeProfile: ProfileKey;
  setProfile: (key: ProfileKey) => void;
  profile: UserProfile;
  load: () => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  activeProfile: 'priya',
  profile: PROFILES.priya,
  setProfile: (key) => {
    const all = (get() as any)._all ?? PROFILES;
    set({ activeProfile: key, profile: all[key] });
  },
  load: async () => {
    const all = await fetchProfiles();
    set({ _all: all, profile: all[get().activeProfile] } as any);
  },
}));
```

Then at app boot (`src/app/main.tsx` or `App.tsx`), call `useProfileStore.getState().load()` once.

### Path B — Full (per-screen migration)

Migrate screens one at a time. Each screen follows this pattern:

```tsx
// HomeTab.tsx — after
import { useEffect, useState } from 'react';
import { fetchProfile } from '../../data/api';
import type { UserProfile } from '../../data/mockData';
import { useProfileStore } from '../../../context/profileStore';

export default function HomeTab() {
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile(activeProfile).then(setProfile);
  }, [activeProfile]);

  if (!profile) return <div>Loading…</div>;
  // …existing JSX, just uses `profile` instead of the store's `profile`
}
```

## 5. Wire the critical flow (Transaction → Risk → Decision → UI)

Today, `SecurityTab.tsx` navigates to `/fraud-alert` via a "Simulate Fraud"
button. That still works. To make a REAL transaction submit trigger the same
screen, add this anywhere you accept user transactions:

```ts
import { submitTransaction } from '../../data/api';
import { useNavigate } from 'react-router';

const nav = useNavigate();

async function onConfirmTransfer() {
  const res = await submitTransaction({
    profileKey: activeProfile,
    amount: Number(amount),
    recipient: recipient,
    recipientIsNew: isNewPayee,
    deviceIsNew: false,          // wire to real device-fingerprint later
    pasteDetected: wasPasted,    // your form tracks this already
    hoverDurationSec: hoverMs / 1000,
  });

  if (res.evaluation.decision === 'ALLOW') {
    toast.success('Transfer successful');
    return nav('/app');
  }
  nav('/fraud-alert', { state: { incidentId: res.evaluation.incidentId } });
}
```

Then in `FraudAlert.tsx`, if you want to show the live incident:

```tsx
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { fetchIncident, type IncidentDetail } from '../../data/api';

const { state } = useLocation() as { state?: { incidentId?: string } };
const [incident, setIncident] = useState<IncidentDetail | null>(null);

useEffect(() => {
  if (state?.incidentId) fetchIncident(state.incidentId).then(setIncident);
}, [state?.incidentId]);
```

The existing static UI still renders fine if `incident` is null — so this is
strictly additive.

## 6. Officer view

`OfficerView.tsx` currently has one hardcoded incident. When ready:

```tsx
import { fetchIncidents, type IncidentSummary } from '../../data/api';

const [list, setList] = useState<IncidentSummary[]>([]);
useEffect(() => { fetchIncidents().then(setList); }, []);
```

The backend seeds one demo incident on startup so this is never empty.

## 7. Demo-safe verification

With the backend running:

```bash
# health
curl http://localhost:8000/health

# profile
curl http://localhost:8000/profiles/priya

# fraud evaluation — low risk
curl -X POST http://localhost:8000/transactions/evaluate \
  -H 'Content-Type: application/json' \
  -d '{"profileKey":"priya","amount":1500,"recipient":"mom@ybl"}'
# → {"score":0,"decision":"ALLOW",...}

# fraud evaluation — high risk
curl -X POST http://localhost:8000/transactions/evaluate \
  -H 'Content-Type: application/json' \
  -d '{"profileKey":"priya","amount":250000,"recipient":"unknown@ybl",
       "recipientIsNew":true,"deviceIsNew":true,"pasteDetected":true,"hoverDurationSec":8.3}'
# → {"score":100,"decision":"BLOCK",...}
```

## Troubleshooting

- **CORS error in browser**: make sure your frontend dev port is one of
  5173 / 3000 / 4173. If not, add it to `main.py` → `allow_origins`.
- **Port already in use**: `uvicorn main:app --reload --port 8001` and update `VITE_API_BASE`.
- **`VITE_API_BASE is undefined`**: restart Vite after creating `.env`.
- **Types don't match**: if you changed `mockData.ts`, mirror the change in
  `app/schemas.py` (backend) + `api.ts` (types).
