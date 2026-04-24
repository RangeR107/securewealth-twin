"""
AI advisor chat endpoints.
"""
from fastapi import APIRouter

from app.data.chat import INITIAL_CHAT
from app.schemas import ChatMessage, ChatRequest, ChatResponse, ProfileKey
from app.services.chat_service import chat_store

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/initial", response_model=list[ChatMessage])
def initial_chat() -> list[ChatMessage]:
    """Seed messages shown before the user sends anything."""
    return INITIAL_CHAT


@router.get("/{profile_key}", response_model=list[ChatMessage])
def get_history(profile_key: ProfileKey) -> list[ChatMessage]:
    return chat_store.history(profile_key)


@router.post("", response_model=ChatResponse)
def send_message(body: ChatRequest) -> ChatResponse:
    reply, history = chat_store.send(body.profileKey, body.message)
    return ChatResponse(reply=reply, history=history)
