from datetime import timedelta

from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_password_hash_and_verify() -> None:
    hashed = hash_password("s3cret")
    assert hashed != "s3cret"
    assert verify_password("s3cret", hashed) is True
    assert verify_password("wrong", hashed) is False


def test_access_token_round_trip() -> None:
    token = create_access_token("user-123")
    assert decode_access_token(token) == "user-123"


def test_expired_token_is_rejected() -> None:
    token = create_access_token("user-1", expires_delta=timedelta(seconds=-1))
    assert decode_access_token(token) is None


def test_garbage_token_is_rejected() -> None:
    assert decode_access_token("not.a.real.token") is None
