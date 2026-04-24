"""
Mock auth — deterministic. Accepts any non-empty mobile/password.
OTP 123456 is always valid (demo). Returns fake tokens.
"""
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from app.schemas import (
    LoginRequest,
    LoginResponse,
    OtpVerifyRequest,
    OtpVerifyResponse,
)
from app.services.audit_service import audit_store

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest) -> LoginResponse:
    if not body.mobile or not body.password:
        raise HTTPException(status_code=400, detail="mobile and password required")
    masked = body.mobile[:2] + "******" + body.mobile[-2:] if len(body.mobile) >= 4 else body.mobile
    audit_store.log(event="login", details={"mobile": masked})
    return LoginResponse(sessionToken=f"sess-{uuid4().hex[:12]}", otpSent=True, maskedMobile=masked)


@router.post("/verify-otp", response_model=OtpVerifyResponse)
def verify_otp(body: OtpVerifyRequest) -> OtpVerifyResponse:
    # demo: 123456 always works; any 6-digit OTP also works for forgiving UX
    if not body.otp or len(body.otp) != 6 or not body.otp.isdigit():
        raise HTTPException(status_code=400, detail="OTP must be 6 digits")
    audit_store.log(event="otp_verified", profile_key="priya", details={"sessionToken": body.sessionToken})
    return OtpVerifyResponse(authToken=f"auth-{uuid4().hex[:16]}", profileKey="priya")
