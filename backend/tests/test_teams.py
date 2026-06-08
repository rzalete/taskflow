from fastapi.testclient import TestClient


def _auth_headers(client: TestClient, email: str = "ali@example.com") -> dict[str, str]:
    client.post(
        "/auth/register",
        json={"email": email, "password": "s3cret", "full_name": "Ali"},
    )
    token = client.post(
        "/auth/login",
        data={"username": email, "password": "s3cret"},
    ).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_team_returns_team(client: TestClient) -> None:
    headers = _auth_headers(client)
    response = client.post("/teams", json={"name": "Taskflow"}, headers=headers)
    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "Taskflow"
    assert "id" in body


def test_list_returns_only_my_teams(client: TestClient) -> None:
    headers_a = _auth_headers(client, "a@example.com")
    client.post("/teams", json={"name": "Team A"}, headers=headers_a)

    headers_b = _auth_headers(client, "b@example.com")
    response = client.get("/teams", headers=headers_b)
    assert response.status_code == 200
    assert response.json() == []


def test_get_team_not_found_for_non_member(client: TestClient) -> None:
    headers_a = _auth_headers(client, "a@example.com")
    team_id = client.post("/teams", json={"name": "Team A"}, headers=headers_a).json()[
        "id"
    ]

    headers_b = _auth_headers(client, "b@example.com")
    response = client.get(f"/teams/{team_id}", headers=headers_b)
    assert response.status_code == 404


def test_owner_can_rename_team(client: TestClient) -> None:
    headers = _auth_headers(client)
    team_id = client.post("/teams", json={"name": "Old"}, headers=headers).json()["id"]
    response = client.patch(f"/teams/{team_id}", json={"name": "New"}, headers=headers)
    assert response.status_code == 200
    assert response.json()["name"] == "New"


def test_owner_can_delete_team(client: TestClient) -> None:
    headers = _auth_headers(client)
    team_id = client.post("/teams", json={"name": "Temp"}, headers=headers).json()["id"]
    assert client.delete(f"/teams/{team_id}", headers=headers).status_code == 204
    assert client.get(f"/teams/{team_id}", headers=headers).status_code == 404


def test_create_team_requires_auth(client: TestClient) -> None:
    response = client.post("/teams", json={"name": "Nope"})
    assert response.status_code == 401
