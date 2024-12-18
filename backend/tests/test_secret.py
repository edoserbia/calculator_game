from fastapi.testclient import TestClient
from ..main import app

client = TestClient(app)

def test_verify_secret():
    response = client.post(
        "/api/verify-secret",
        json={"code": "9527*9527-9527="}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] == True
    assert data["game_type"] == "snake"

def test_verify_invalid_secret():
    response = client.post(
        "/api/verify-secret",
        json={"code": "invalid-code"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] == False
    assert data["game_type"] == None 