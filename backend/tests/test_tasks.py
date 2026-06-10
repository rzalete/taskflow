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


def _user_id(client: TestClient, headers: dict[str, str]) -> int:
    return int(client.get("/auth/me", headers=headers).json()["id"])


def _create_team(client: TestClient, headers: dict[str, str]) -> int:
    response = client.post("/teams", json={"name": "Taskflow"}, headers=headers)
    return int(response.json()["id"])


def _create_project(client: TestClient, team_id: int, headers: dict[str, str]) -> int:
    response = client.post(
        f"/teams/{team_id}/projects",
        json={"name": "Backend"},
        headers=headers,
    )
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


def test_member_can_create_and_list_tasks(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    project_id = _create_project(client, team_id, owner)
    member = _add_member(client, team_id, owner, "member@example.com")
    base = f"/teams/{team_id}/projects/{project_id}/tasks"

    response = client.post(base, json={"title": "Write tests"}, headers=member)
    assert response.status_code == 201
    body = response.json()
    assert body["title"] == "Write tests"
    assert body["status"] == "backlog"
    assert body["priority"] == "medium"
    assert body["assignee_id"] is None

    listing = client.get(base, headers=member)
    assert listing.status_code == 200
    assert len(listing.json()) == 1


def test_can_assign_task_to_team_member(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    project_id = _create_project(client, team_id, owner)
    member = _add_member(client, team_id, owner, "member@example.com")
    member_id = _user_id(client, member)
    base = f"/teams/{team_id}/projects/{project_id}/tasks"

    response = client.post(
        base,
        json={"title": "Assigned task", "assignee_id": member_id},
        headers=owner,
    )
    assert response.status_code == 201
    assert response.json()["assignee_id"] == member_id


def test_assign_non_member_returns_400(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    project_id = _create_project(client, team_id, owner)
    outsider = _token(client, "outsider@example.com")
    outsider_id = _user_id(client, outsider)
    base = f"/teams/{team_id}/projects/{project_id}/tasks"

    response = client.post(
        base,
        json={"title": "Nope", "assignee_id": outsider_id},
        headers=owner,
    )
    assert response.status_code == 400


def test_filter_tasks_by_status(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    project_id = _create_project(client, team_id, owner)
    base = f"/teams/{team_id}/projects/{project_id}/tasks"
    client.post(base, json={"title": "A", "status": "todo"}, headers=owner)
    client.post(base, json={"title": "B", "status": "done"}, headers=owner)

    response = client.get(base, params={"status": "todo"}, headers=owner)
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["title"] == "A"


def test_filter_tasks_by_assignee(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    project_id = _create_project(client, team_id, owner)
    member = _add_member(client, team_id, owner, "member@example.com")
    member_id = _user_id(client, member)
    base = f"/teams/{team_id}/projects/{project_id}/tasks"
    client.post(
        base,
        json={"title": "Assigned", "assignee_id": member_id},
        headers=owner,
    )
    client.post(base, json={"title": "Unassigned"}, headers=owner)

    response = client.get(base, params={"assignee_id": member_id}, headers=owner)
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["title"] == "Assigned"


def test_member_can_update_task_status(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    project_id = _create_project(client, team_id, owner)
    member = _add_member(client, team_id, owner, "member@example.com")
    base = f"/teams/{team_id}/projects/{project_id}/tasks"
    task_id = client.post(base, json={"title": "Move me"}, headers=member).json()["id"]

    response = client.patch(
        f"{base}/{task_id}",
        json={"status": "in_progress"},
        headers=member,
    )
    assert response.status_code == 200
    assert response.json()["status"] == "in_progress"


def test_only_owner_or_admin_can_delete_task(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    project_id = _create_project(client, team_id, owner)
    member = _add_member(client, team_id, owner, "member@example.com")
    base = f"/teams/{team_id}/projects/{project_id}/tasks"
    task_id = client.post(base, json={"title": "Delete me"}, headers=member).json()[
        "id"
    ]

    forbidden = client.delete(f"{base}/{task_id}", headers=member)
    assert forbidden.status_code == 403

    allowed = client.delete(f"{base}/{task_id}", headers=owner)
    assert allowed.status_code == 204


def test_get_unknown_task_returns_404(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    project_id = _create_project(client, team_id, owner)
    base = f"/teams/{team_id}/projects/{project_id}/tasks"
    response = client.get(f"{base}/999", headers=owner)
    assert response.status_code == 404


def test_create_task_appends_to_end_of_its_column(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    project_id = _create_project(client, team_id, owner)
    base = f"/teams/{team_id}/projects/{project_id}/tasks"

    first = client.post(
        base, json={"title": "A", "status": "todo"}, headers=owner
    ).json()
    second = client.post(
        base, json={"title": "B", "status": "todo"}, headers=owner
    ).json()
    other_column = client.post(
        base, json={"title": "C", "status": "done"}, headers=owner
    ).json()

    assert first["position"] == 0
    assert second["position"] == 1
    # Separate column keeps its own sequence.
    assert other_column["position"] == 0


def test_move_task_reorders_within_a_column(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    project_id = _create_project(client, team_id, owner)
    base = f"/teams/{team_id}/projects/{project_id}/tasks"
    client.post(base, json={"title": "A", "status": "todo"}, headers=owner)
    client.post(base, json={"title": "B", "status": "todo"}, headers=owner)
    c_id = client.post(
        base, json={"title": "C", "status": "todo"}, headers=owner
    ).json()["id"]

    moved = client.patch(
        f"{base}/{c_id}/move",
        json={"status": "todo", "position": 0},
        headers=owner,
    )
    assert moved.status_code == 200
    assert moved.json()["position"] == 0

    todo = client.get(base, params={"status": "todo"}, headers=owner).json()
    assert [(t["title"], t["position"]) for t in todo] == [
        ("C", 0),
        ("A", 1),
        ("B", 2),
    ]


def test_move_task_to_another_column_sets_status_and_reindexes(
    client: TestClient,
) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    project_id = _create_project(client, team_id, owner)
    base = f"/teams/{team_id}/projects/{project_id}/tasks"
    a_id = client.post(
        base, json={"title": "A", "status": "todo"}, headers=owner
    ).json()["id"]
    client.post(base, json={"title": "B", "status": "todo"}, headers=owner)
    client.post(base, json={"title": "D", "status": "done"}, headers=owner)

    moved = client.patch(
        f"{base}/{a_id}/move",
        json={"status": "done", "position": 0},
        headers=owner,
    ).json()
    assert moved["status"] == "done"
    assert moved["position"] == 0

    # Source column closed its gap.
    todo = client.get(base, params={"status": "todo"}, headers=owner).json()
    assert [(t["title"], t["position"]) for t in todo] == [("B", 0)]
    # Destination column re-indexed with A in front.
    done = client.get(base, params={"status": "done"}, headers=owner).json()
    assert [(t["title"], t["position"]) for t in done] == [("A", 0), ("D", 1)]


def test_member_can_move_task(client: TestClient) -> None:
    owner = _token(client, "owner@example.com")
    team_id = _create_team(client, owner)
    project_id = _create_project(client, team_id, owner)
    member = _add_member(client, team_id, owner, "member@example.com")
    base = f"/teams/{team_id}/projects/{project_id}/tasks"
    task_id = client.post(
        base, json={"title": "Move me", "status": "todo"}, headers=owner
    ).json()["id"]

    response = client.patch(
        f"{base}/{task_id}/move",
        json={"status": "in_progress", "position": 0},
        headers=member,
    )
    assert response.status_code == 200
    assert response.json()["status"] == "in_progress"
