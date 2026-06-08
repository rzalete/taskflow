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


def _add_member(
    client: TestClient,
    team_id: int,
    owner: dict[str, str],
    email: str,
    role: str = "member",
) -> dict[str, str]:
    member = _token(client, email)
    client.post(
        f"/teams/{team_id}/members",
        json={"email": email, "role": role},
        headers=owner,
    )
    return member


def test_owner_can_create_and_list_projects(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    response = client.post(
        f"/teams/{team_id}/projects",
        json={"name": "Website", "description": "Marketing site"},
        headers=owner,
    )
    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "Website"
    assert body["description"] == "Marketing site"
    assert body["team_id"] == team_id

    listing = client.get(f"/teams/{team_id}/projects", headers=owner)
    assert listing.status_code == 200
    assert len(listing.json()) == 1


def test_member_can_list_but_not_create(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    client.post(
        f"/teams/{team_id}/projects",
        json={"name": "Website"},
        headers=owner,
    )
    member = _add_member(client, team_id, owner, "member@example.com")

    listing = client.get(f"/teams/{team_id}/projects", headers=member)
    assert listing.status_code == 200
    assert len(listing.json()) == 1

    forbidden = client.post(
        f"/teams/{team_id}/projects",
        json={"name": "Nope"},
        headers=member,
    )
    assert forbidden.status_code == 403


def test_get_unknown_project_returns_404(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    response = client.get(f"/teams/{team_id}/projects/999", headers=owner)
    assert response.status_code == 404


def test_non_member_cannot_list_projects(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    outsider = _token(client, "outsider@example.com")
    response = client.get(f"/teams/{team_id}/projects", headers=outsider)
    assert response.status_code == 404


def test_owner_can_update_project(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    project_id = client.post(
        f"/teams/{team_id}/projects",
        json={"name": "Old", "description": None},
        headers=owner,
    ).json()["id"]
    response = client.patch(
        f"/teams/{team_id}/projects/{project_id}",
        json={"name": "New", "description": "Updated"},
        headers=owner,
    )
    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "New"
    assert body["description"] == "Updated"


def test_owner_can_delete_project(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    project_id = client.post(
        f"/teams/{team_id}/projects", json={"name": "Temp"}, headers=owner
    ).json()["id"]
    assert (
        client.delete(
            f"/teams/{team_id}/projects/{project_id}", headers=owner
        ).status_code
        == 204
    )
    listing = client.get(f"/teams/{team_id}/projects", headers=owner)
    assert listing.json() == []
