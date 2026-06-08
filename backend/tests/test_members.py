from fastapi.testclient import TestClient


def _token(client: TestClient, email: str) -> dict[str, str]:
    client.post(
        "/auth/register",
        json={"email": email, "password": "s3cret", "full_name": email},
    )
    token = client.post(
        "/auth/login",
        data={"username": email, "password": "s3cret"},
    ).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def _create_team(client: TestClient, headers: dict[str, str]) -> int:
    response = client.post("/teams", json={"name": "Taskflow"}, headers=headers)
    return int(response.json()["id"])


def test_owner_can_add_and_list_members(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    _token(client, "member@example.com")  # the user must exist first

    response = client.post(
        f"/teams/{team_id}/members",
        json={"email": "member@example.com", "role": "member"},
        headers=owner,
    )
    assert response.status_code == 201
    assert response.json()["role"] == "member"

    listing = client.get(f"/teams/{team_id}/members", headers=owner)
    assert listing.status_code == 200
    assert len(listing.json()) == 2


def test_add_unknown_user_returns_404(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    response = client.post(
        f"/teams/{team_id}/members",
        json={"email": "ghost@example.com", "role": "member"},
        headers=owner,
    )
    assert response.status_code == 404


def test_add_duplicate_member_returns_400(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    _token(client, "member@example.com")
    payload = {"email": "member@example.com", "role": "member"}
    client.post(f"/teams/{team_id}/members", json=payload, headers=owner)
    response = client.post(f"/teams/{team_id}/members", json=payload, headers=owner)
    assert response.status_code == 400


def test_non_member_cannot_list_members(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    outsider = _token(client, "outsider@example.com")
    response = client.get(f"/teams/{team_id}/members", headers=outsider)
    assert response.status_code == 404


def test_member_cannot_add_members(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    member = _token(client, "member@example.com")
    client.post(
        f"/teams/{team_id}/members",
        json={"email": "member@example.com", "role": "member"},
        headers=owner,
    )
    _token(client, "another@example.com")
    response = client.post(
        f"/teams/{team_id}/members",
        json={"email": "another@example.com", "role": "member"},
        headers=member,
    )
    assert response.status_code == 403


def test_owner_can_change_member_role(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    _token(client, "member@example.com")
    add = client.post(
        f"/teams/{team_id}/members",
        json={"email": "member@example.com", "role": "member"},
        headers=owner,
    )
    user_id = add.json()["user_id"]
    response = client.patch(
        f"/teams/{team_id}/members/{user_id}",
        json={"role": "admin"},
        headers=owner,
    )
    assert response.status_code == 200
    assert response.json()["role"] == "admin"


def test_cannot_demote_last_owner(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    me = client.get("/auth/me", headers=owner).json()
    response = client.patch(
        f"/teams/{team_id}/members/{me['id']}",
        json={"role": "member"},
        headers=owner,
    )
    assert response.status_code == 400


def test_owner_can_remove_member(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    _token(client, "member@example.com")
    add = client.post(
        f"/teams/{team_id}/members",
        json={"email": "member@example.com", "role": "member"},
        headers=owner,
    )
    user_id = add.json()["user_id"]
    assert (
        client.delete(f"/teams/{team_id}/members/{user_id}", headers=owner).status_code
        == 204
    )
    listing = client.get(f"/teams/{team_id}/members", headers=owner)
    assert len(listing.json()) == 1
