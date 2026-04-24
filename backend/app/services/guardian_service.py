"""
Guardian service — in-memory store for the Guardian feature.
Requests start 'pending', auto-expire after 48h (demo only; clock is stubbed).
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from threading import Lock
from typing import List
from uuid import uuid4

from app.schemas import Guardian, GuardianRequestBody, ProfileKey
from app.services.audit_service import audit_store


class GuardianStore:
    def __init__(self) -> None:
        self._guardians: dict[str, Guardian] = {}
        self._lock = Lock()

    def add(self, body: GuardianRequestBody) -> Guardian:
        now = datetime.now(timezone.utc)
        gid = f"GRD-{uuid4().hex[:8].upper()}"
        g = Guardian(
            guardianId=gid,
            profileKey=body.profileKey,
            name=body.name,
            phone=body.phone,
            relationship=body.relationship,
            status="pending",
            createdAt=now.isoformat(),
            expiresAt=(now + timedelta(hours=48)).isoformat(),
        )
        with self._lock:
            self._guardians[gid] = g
        audit_store.log(
            event="guardian_added",
            profile_key=body.profileKey,
            details={"guardianId": gid, "name": body.name, "relationship": body.relationship},
        )
        return g

    def list_for(self, profile_key: ProfileKey) -> List[Guardian]:
        return [g for g in self._guardians.values() if g.profileKey == profile_key]

    def revoke(self, guardian_id: str) -> Guardian | None:
        g = self._guardians.get(guardian_id)
        if not g:
            return None
        g.status = "revoked"
        audit_store.log(event="guardian_revoked", profile_key=g.profileKey, details={"guardianId": guardian_id})
        return g


guardian_store = GuardianStore()
