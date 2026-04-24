"""
Chat service — deterministic, keyword-matched canned replies.
History is per-profile, in-memory.
"""
from __future__ import annotations

from threading import Lock
from typing import Dict, List

from app.data.chat import CANNED_REPLIES, DEFAULT_REPLY, INITIAL_CHAT
from app.schemas import ChatMessage, ProfileKey


class ChatStore:
    def __init__(self) -> None:
        self._history: Dict[str, List[ChatMessage]] = {}
        self._lock = Lock()

    def _for(self, profile_key: ProfileKey) -> List[ChatMessage]:
        if profile_key not in self._history:
            # fresh copy so we don't mutate INITIAL_CHAT
            self._history[profile_key] = [m.model_copy() for m in INITIAL_CHAT]
        return self._history[profile_key]

    def history(self, profile_key: ProfileKey) -> List[ChatMessage]:
        with self._lock:
            return list(self._for(profile_key))

    def send(self, profile_key: ProfileKey, message: str) -> tuple[ChatMessage, List[ChatMessage]]:
        user_msg = ChatMessage(role="user", text=message)
        reply = self._match(message)
        with self._lock:
            hist = self._for(profile_key)
            hist.append(user_msg)
            hist.append(reply)
            return reply, list(hist)

    @staticmethod
    def _match(message: str) -> ChatMessage:
        m = message.lower()
        for keywords, reply in CANNED_REPLIES:
            if any(k in m for k in keywords):
                return reply.model_copy()
        return DEFAULT_REPLY.model_copy()


chat_store = ChatStore()
