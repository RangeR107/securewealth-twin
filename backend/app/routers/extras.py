"""
/extras — KYC status, notifications, compliance documents, help FAQs.

  GET  /extras/{profile_key}/kyc
  GET  /extras/{profile_key}/notifications
  POST /extras/{profile_key}/notifications/{notif_id}/read
  GET  /extras/compliance
  GET  /extras/help
"""
from fastapi import APIRouter, HTTPException

from app.data.extras import COMPLIANCE_DOCS, HELP_FAQS, KYC, NOTIFICATIONS
from app.data.profiles import PROFILES
from app.schemas import (
    ComplianceDoc,
    HelpFaq,
    KycStatus,
    NotificationItem,
    ProfileKey,
)

router = APIRouter(prefix="/extras", tags=["extras"])


def _assert_profile(profile_key: str) -> None:
    if profile_key not in PROFILES:
        raise HTTPException(status_code=404, detail="Unknown profile")


@router.get("/{profile_key}/kyc", response_model=KycStatus)
def get_kyc(profile_key: ProfileKey) -> KycStatus:
    _assert_profile(profile_key)
    return KYC[profile_key]


@router.get("/{profile_key}/notifications", response_model=list[NotificationItem])
def list_notifications(profile_key: ProfileKey) -> list[NotificationItem]:
    _assert_profile(profile_key)
    return NOTIFICATIONS.get(profile_key, [])


@router.post("/{profile_key}/notifications/{notif_id}/read", response_model=NotificationItem)
def mark_read(profile_key: ProfileKey, notif_id: str) -> NotificationItem:
    _assert_profile(profile_key)
    items = NOTIFICATIONS.get(profile_key, [])
    for n in items:
        if n.id == notif_id:
            n.read = True
            return n
    raise HTTPException(status_code=404, detail="Notification not found")


@router.get("/compliance", response_model=list[ComplianceDoc])
def list_compliance() -> list[ComplianceDoc]:
    return COMPLIANCE_DOCS


@router.get("/help", response_model=list[HelpFaq])
def list_help() -> list[HelpFaq]:
    return HELP_FAQS
