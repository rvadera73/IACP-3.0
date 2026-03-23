"""
Tests for Advanced AI Service
"""

import pytest
from app.services.ai_advanced import (
    calculate_judge_score,
    suggest_judges,
    predict_deficiencies,
    predict_case_outcome,
    check_citation,
    search_case_law,
    search_regulations
)

class TestJudgeAssignment:
    """Test smart judge assignment"""
    
    def test_calculate_judge_score_perfect_match(self):
        """Test judge with perfect match"""
        judge = {
            "id": "judge-1",
            "name": "Hon. Sarah Jenkins",
            "office": "Pittsburgh",
            "capacity": 75,
            "active_cases": 25,
            "specialty": ["BLA", "LHC"],
            "last_assigned_days_ago": 10
        }
        
        score = calculate_judge_score(judge, "BLA", "Pittsburgh")
        
        assert score["total"] > 80
        assert score["breakdown"]["geography"] == 30
        assert score["breakdown"]["expertise"] == 20
    
    def test_calculate_judge_score_mismatch(self):
        """Test judge with mismatch"""
        judge = {
            "id": "judge-2",
            "name": "Hon. Michael Ross",
            "office": "New York",
            "capacity": 75,
            "active_cases": 70,
            "specialty": ["PER"],
            "last_assigned_days_ago": 1
        }
        
        score = calculate_judge_score(judge, "BLA", "Pittsburgh")
        
        assert score["breakdown"]["geography"] == 0
        assert score["breakdown"]["expertise"] == 10
    
    def test_suggest_judges_returns_top_3(self):
        """Test judge suggestion returns top 3"""
        judges = [
            {"id": f"judge-{i}", "name": f"Judge {i}", "office": "Pittsburgh", 
             "capacity": 75, "active_cases": i*10, "specialty": ["BLA"],
             "last_assigned_days_ago": i*5}
            for i in range(1, 6)
        ]
        
        suggestions = suggest_judges(judges, "BLA", "Pittsburgh", limit=3)
        
        assert len(suggestions) == 3
        assert suggestions[0]["score"] >= suggestions[1]["score"]
        assert suggestions[1]["score"] >= suggestions[2]["score"]

class TestDeficiencyPrediction:
    """Test deficiency prediction"""
    
    def test_detect_missing_signature(self):
        """Test missing signature detection"""
        text = "This document has no signature detected in the signature field"
        deficiencies = predict_deficiencies(text)
        
        assert any(d["type"] == "missing_signature" for d in deficiencies)
    
    def test_detect_missing_ssn(self):
        """Test missing SSN detection"""
        text = "SSN field missing from the form"
        deficiencies = predict_deficiencies(text)
        
        assert any(d["type"] == "missing_ssn" for d in deficiencies)
        assert any(d["severity"] == "critical" for d in deficiencies)
    
    def test_clean_document(self):
        """Test clean document has no deficiencies"""
        text = "Complete and properly filled document with all required fields"
        deficiencies = predict_deficiencies(text)
        
        assert len(deficiencies) == 0

class TestCaseOutcomePrediction:
    """Test case outcome prediction"""
    
    def test_bla_with_evidence(self):
        """Test BLA case with strong evidence"""
        case_data = {
            "case_type": "BLA",
            "has_medical_evidence": True,
            "has_employment_records": True,
            "is_pro_se": False
        }
        
        outcome = predict_case_outcome(case_data)
        
        assert outcome["likely_outcome"] == "approved"
        assert outcome["confidence"] >= 0.7
    
    def test_bla_without_evidence(self):
        """Test BLA case without evidence"""
        case_data = {
            "case_type": "BLA",
            "has_medical_evidence": False,
            "has_employment_records": False,
            "is_pro_se": False
        }
        
        outcome = predict_case_outcome(case_data)
        
        assert outcome["likely_outcome"] == "denied"
    
    def test_pro_se_factor(self):
        """Test pro se claimant factor"""
        case_data = {
            "case_type": "BLA",
            "has_medical_evidence": True,
            "has_employment_records": True,
            "is_pro_se": True
        }
        
        outcome = predict_case_outcome(case_data)
        
        assert any("Pro se" in factor for factor in outcome["factors"])

class TestCitationChecker:
    """Test citation validation"""
    
    def test_valid_cfr_citation(self):
        """Test valid CFR citation"""
        result = check_citation("20 C.F.R. § 718.202")
        
        assert result["valid"] is True
        assert result["type"] == "CFR"
    
    def test_valid_usc_citation(self):
        """Test valid USC citation"""
        result = check_citation("33 U.S.C. § 901")
        
        assert result["valid"] is True
        assert result["type"] == "USC"
    
    def test_invalid_citation(self):
        """Test invalid citation"""
        result = check_citation("Invalid Citation Format")
        
        assert result["valid"] is False
        assert len(result["suggestions"]) > 0

class TestLegalResearch:
    """Test legal research assistant"""
    
    def test_search_case_law(self):
        """Test case law search"""
        results = search_case_law("Black Lung")
        
        assert len(results) > 0
        assert "citation" in results[0]
        assert "summary" in results[0]
    
    def test_search_regulations(self):
        """Test regulation search"""
        results = search_regulations("pneumoconiosis")
        
        assert len(results) > 0
        assert "20 C.F.R." in results[0]["title"]
