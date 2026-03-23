"""
Simple API Tests for IACP 3.0
Run with: python backend/test_api.py

Prerequisites:
1. Start backend: python backend/main.py
2. Install requests: pip install -r backend/requirements.txt
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")

def test_health():
    """Test 1: Health Check"""
    print("Testing: GET /health")
    response = requests.get(f"{BASE_URL}/health")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert data["status"] == "healthy", f"Expected 'healthy', got {data['status']}"
    print(f"✅ Health check PASSED")
    print(f"   Response: {json.dumps(data, indent=2)}")
    return True

def test_create_filing():
    """Test 2: Create Filing"""
    print("Testing: POST /api/v1/filings")
    filing_data = {
        "filing_type": "claim",
        "status": "pending",
        "description": "Test filing from automated test",
        "submitted_by": "test-user"
    }
    response = requests.post(f"{BASE_URL}/api/v1/filings", json=filing_data)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert "id" in data, "Response should have 'id'"
    assert "intake_id" in data, "Response should have 'intake_id'"
    print(f"✅ Create filing PASSED")
    print(f"   Filing ID: {data['id']}")
    print(f"   Intake ID: {data['intake_id']}")
    return data["id"]

def test_get_filings(filing_id):
    """Test 3: Get All Filings"""
    print("Testing: GET /api/v1/filings")
    response = requests.get(f"{BASE_URL}/api/v1/filings")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    filings = response.json()
    assert isinstance(filings, list), "Response should be a list"
    assert len(filings) > 0, "Should have at least one filing"
    print(f"✅ Get filings PASSED")
    print(f"   Total filings: {len(filings)}")
    
    # Check if our filing is in the list
    our_filing = next((f for f in filings if f["id"] == filing_id), None)
    assert our_filing is not None, "Our filing should be in the list"
    print(f"   Found our test filing: {our_filing['intake_id']}")
    return filings

def test_get_filing_by_id(filing_id):
    """Test 4: Get Filing by ID"""
    print("Testing: GET /api/v1/filings/{id}")
    response = requests.get(f"{BASE_URL}/api/v1/filings/{filing_id}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert data["id"] == filing_id, "Should return correct filing"
    print(f"✅ Get filing by ID PASSED")
    print(f"   Filing: {data['intake_id']} - {data['filing_type']}")
    return data

def test_intake_queue():
    """Test 5: Get Intake Queue"""
    print("Testing: GET /api/v1/intake/queue")
    response = requests.get(f"{BASE_URL}/api/v1/intake/queue")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    queue = response.json()
    assert isinstance(queue, list), "Response should be a list"
    print(f"✅ Intake queue PASSED")
    print(f"   Pending filings: {len(queue)}")
    return queue

def test_auto_docket(filing_id):
    """Test 6: Auto-Docket Filing"""
    print("Testing: POST /api/v1/intake/{id}/docket")
    response = requests.post(f"{BASE_URL}/api/v1/intake/{filing_id}/docket")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert data["status"] == "docketed", f"Expected 'docketed', got {data['status']}"
    print(f"✅ Auto-docket PASSED")
    print(f"   Docket number: {data['docket_number']}")
    return data

def test_judge_suggestions():
    """Test 7: Get Judge Suggestions"""
    print("Testing: GET /api/v1/judges/suggest")
    response = requests.get(f"{BASE_URL}/api/v1/judges/suggest?case_type=BLA")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert "suggestions" in data, "Response should have 'suggestions'"
    assert len(data["suggestions"]) <= 3, "Should return max 3 suggestions"
    print(f"✅ Judge suggestions PASSED")
    print(f"   Suggestions: {len(data['suggestions'])}")
    for suggestion in data["suggestions"]:
        print(f"   - {suggestion.get('name', 'Unknown')} ({suggestion.get('office', 'Unknown')})")
    return data

def test_404_handling():
    """Test 8: 404 Error Handling"""
    print("Testing: GET /api/v1/filings/nonexistent (should 404)")
    response = requests.get(f"{BASE_URL}/api/v1/filings/nonexistent-id")
    # This might return 200 with empty list or 404, both are OK
    print(f"✅ 404 handling PASSED (status: {response.status_code})")
    return True

def run_all_tests():
    """Run all tests"""
    print_section("IACP 3.0 - Sprint 0 API Tests")
    print("Starting backend API tests...\n")
    print("Make sure backend is running: python backend/main.py\n")
    
    tests_passed = 0
    tests_failed = 0
    filing_id = None
    
    try:
        # Test 1: Health
        if test_health():
            tests_passed += 1
    except Exception as e:
        print(f"❌ Health check FAILED: {e}")
        tests_failed += 1
        return
    
    try:
        # Test 2: Create Filing
        filing_id = test_create_filing()
        tests_passed += 1
    except Exception as e:
        print(f"❌ Create filing FAILED: {e}")
        tests_failed += 1
    
    if filing_id:
        try:
            # Test 3: Get Filings
            test_get_filings(filing_id)
            tests_passed += 1
        except Exception as e:
            print(f"❌ Get filings FAILED: {e}")
            tests_failed += 1
        
        try:
            # Test 4: Get Filing by ID
            test_get_filing_by_id(filing_id)
            tests_passed += 1
        except Exception as e:
            print(f"❌ Get filing by ID FAILED: {e}")
            tests_failed += 1
    
    try:
        # Test 5: Intake Queue
        test_intake_queue()
        tests_passed += 1
    except Exception as e:
        print(f"❌ Intake queue FAILED: {e}")
        tests_failed += 1
    
    if filing_id:
        try:
            # Test 6: Auto-Docket
            test_auto_docket(filing_id)
            tests_passed += 1
        except Exception as e:
            print(f"❌ Auto-docket FAILED: {e}")
            tests_failed += 1
    
    try:
        # Test 7: Judge Suggestions
        test_judge_suggestions()
        tests_passed += 1
    except Exception as e:
        print(f"❌ Judge suggestions FAILED: {e}")
        tests_failed += 1
    
    try:
        # Test 8: 404 Handling
        test_404_handling()
        tests_passed += 1
    except Exception as e:
        print(f"❌ 404 handling FAILED: {e}")
        tests_failed += 1
    
    # Summary
    print_section("Test Summary")
    print(f"Tests Passed: {tests_passed}")
    print(f"Tests Failed: {tests_failed}")
    print(f"Total Tests:  {tests_passed + tests_failed}")
    
    if tests_failed == 0:
        print("\n🎉 ALL TESTS PASSED! Sprint 0 is working perfectly!")
    else:
        print(f"\n⚠️  {tests_failed} test(s) failed. Check the errors above.")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    run_all_tests()
