from fastapi.testclient import TestClient


def _register(client: TestClient, email: str = "ali@example.com") -> None:
    response = client.post(
        "/auth/register",
        json={"email": email, "password": "s3cret", "full_name": "Ali"},
    )
    assert response.status_code == 201


def test_register_creates_user(client: TestClient) -> None:
    response = client.post(
        "/auth/register",
        json={"email": "new@example.com", "password": "s3cret", "full_name": "New"},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["email"] == "new@example.com"
    assert "id" in body
    assert "hashed_password" not in body


def test_register_rejects_duplicate_email(client: TestClient) -> None:
    _register(client)
    response = client.post(
        "/auth/register",
        json={"email": "ali@example.com", "password": "x", "full_name": "Ali"},
    )
    assert response.status_code == 400


def test_login_returns_token(client: TestClient) -> None:
    _register(client)
    response = client.post(
        "/auth/login",
        data={"username": "ali@example.com", "password": "s3cret"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]


def test_login_rejects_bad_password(client: TestClient) -> None:
    _register(client)
    response = client.post(
        "/auth/login",
        data={"username": "ali@example.com", "password": "wrong"},
    )
    assert response.status_code == 401


def test_me_returns_current_user(client: TestClient) -> None:
    _register(client)
    login = client.post(
        "/auth/login",
        data={"username": "ali@example.com", "password": "s3cret"},
    )
    token = login.json()["access_token"]
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "ali@example.com"


def test_me_requires_auth(client: TestClient) -> None:
    response = client.get("/auth/me")
    assert response.status_code == 401
