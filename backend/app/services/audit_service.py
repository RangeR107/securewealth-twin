"""
Append-only in-memory audit log. Deterministic IDs (auto-increment).
Safe for demo — no persistence, no I/O.
"""
from __future__ import annotations

from datetime import datetime, timezone
from threading import Lock
from typing import List, Optional

from app.schemas import AuditLogEntry, ProfileKey


class AuditStore:
    def __init__(self) -> None:
        self._entries: List[AuditLogEntry] = []
        self._next_id: int = 1
        self._lock = Lock()

    def log(
        self,
        event: str,
        profile_key: Optional[ProfileKey] = None,
        details: Optional[dict] = None,
    ) -> AuditLogEntry:
        with self._lock:
            entry = AuditLogEntry(
                id=self._next_id,
                timestamp=datetime.now(timezone.utc).isoformat(),
                profileKey=profile_key,
                event=event,
                details=details or {},
            )
            self._next_id += 1
            self._entries.append(entry)
            return entry

    def list(
        self,
        profile_key: Optional[ProfileKey] = None,
        limit: int = 100,
    ) -> List[AuditLogEntry]:
        items = self._entries
        if profile_key is not None:
            items = [e for e in items if e.profileKey == profile_key]
        # newest first
        return list(reversed(items))[:limit]

    def total(self, profile_key: Optional[ProfileKey] = None) -> int:
        if profile_key is None:
            return len(self._entries)
        return sum(1 for e in self._entries if e.profileKey == profile_key)


audit_store = AuditStore()
