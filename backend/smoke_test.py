"""
Backend smoke test for the Phase 1 filing flow.

Run from the repo root with dependencies available on PYTHONPATH, for example:
  $env:PYTHONPATH='C:\\path\\to\\vendor_pkgs'; python backend\\smoke_test.py
"""

from pathlib import Path
import os
import sys

from starlette.testclient import TestClient


REPO_ROOT = Path(__file__).resolve().parents[1]
BACKEND_DIR = REPO_ROOT / "backend"

os.chdir(BACKEND_DIR)
sys.path.insert(0, str(BACKEND_DIR))

import main  # noqa: E402


def run_smoke_test() -> None:
    client = TestClient(main.app)

    create_payload = {
        "filing_type": "BLA claim",
        "status": "pending",
        "description": "Claimant: Smoke Test Miner. Employer: Demo Coal Co.",
        "submitted_by": "smoke-test-user",
    }

    health = client.get("/health")
    assert health.status_code == 200, health.text

    created = client.post("/api/v1/filings", json=create_payload)
    assert created.status_code == 201, created.text
    filing = created.json()

    queue = client.get("/api/v1/intake/queue")
    assert queue.status_code == 200, queue.text

    docketed = client.post(f"/api/v1/intake/{filing['id']}/docket")
    assert docketed.status_code == 200, docketed.text
    docket_result = docketed.json()
    assert docket_result["docket_number"].startswith("2026BLA"), docket_result

    updated_filing = client.get(f"/api/v1/filings/{filing['id']}")
    assert updated_filing.status_code == 200, updated_filing.text
    updated_data = updated_filing.json()
    assert updated_data["status"] == "accepted", updated_data
    assert updated_data["case_id"], updated_data

    cases = client.get("/api/v1/cases")
    assert cases.status_code == 200, cases.text

    suggestions = client.get("/api/v1/judges/suggest", params={"case_type": "BLA"})
    assert suggestions.status_code == 200, suggestions.text

    print("Smoke test passed")
    print(f"Filing ID: {filing['id']}")
    print(f"Docket Number: {docket_result['docket_number']}")


if __name__ == "__main__":
    run_smoke_test()
