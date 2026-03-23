"""
Advanced AI Service for IACP 3.0
Smart judge assignment, deficiency prediction, case outcome prediction
"""

from typing import List, Dict
from datetime import datetime, timedelta
import random

# ============ Smart Judge Assignment ============

def calculate_judge_score(
    judge: dict,
    case_type: str,
    office: str
) -> Dict:
    """
    Calculate judge assignment score based on:
    - 40% Workload balance
    - 30% Geographic expertise
    - 20% Case type expertise
    - 10% Rotation fairness
    """
    
    # Workload score (40%) - lower load = higher score
    capacity = judge.get("capacity", 75)
    active_cases = judge.get("active_cases", 0)
    workload_score = (1 - (active_cases / capacity)) * 40
    
    # Geography score (30%) - same office = higher score
    judge_office = judge.get("office", "")
    geography_score = 30 if judge_office == office else 0
    
    # Expertise score (20%) - case type match = higher score
    specialty = judge.get("specialty", [])
    expertise_score = 20 if case_type in specialty else 10
    
    # Rotation score (10%) - least recent = higher score
    last_assigned = judge.get("last_assigned_days_ago", 0)
    rotation_score = min(10, last_assigned / 3)
    
    total_score = workload_score + geography_score + expertise_score + rotation_score
    
    return {
        "total": round(total_score, 2),
        "breakdown": {
            "workload": round(workload_score, 2),
            "geography": round(geography_score, 2),
            "expertise": round(expertise_score, 2),
            "rotation": round(rotation_score, 2)
        },
        "reasons": generate_assignment_reasons(
            workload_score, geography_score, expertise_score, rotation_score
        )
    }

def generate_assignment_reasons(
    workload: float,
    geography: float,
    expertise: float,
    rotation: float
) -> List[str]:
    """Generate human-readable reasons for assignment"""
    reasons = []
    
    if workload >= 35:
        reasons.append("Low workload - can take more cases")
    elif workload < 20:
        reasons.append("High workload - approaching capacity")
    
    if geography == 30:
        reasons.append("Same office - geographic expertise")
    
    if expertise == 20:
        reasons.append("Case type specialist")
    
    if rotation >= 8:
        reasons.append("Fair rotation - hasn't had similar case recently")
    
    return reasons

def suggest_judges(
    judges: List[dict],
    case_type: str,
    office: str,
    limit: int = 3
) -> List[Dict]:
    """
    Suggest top judges for case assignment
    Returns top N judges with scores and reasons
    """
    scored_judges = []
    
    for judge in judges:
        score = calculate_judge_score(judge, case_type, office)
        scored_judges.append({
            "judge_id": judge.get("id"),
            "name": judge.get("name"),
            "office": judge.get("office"),
            "score": score["total"],
            "breakdown": score["breakdown"],
            "reasons": score["reasons"]
        })
    
    # Sort by score descending
    scored_judges.sort(key=lambda x: x["score"], reverse=True)
    
    return scored_judges[:limit]

# ============ Deficiency Prediction ============

DEFICIENCY_PATTERNS = {
    "missing_signature": [
        "no signature detected",
        "signature field empty",
        "unsigned document"
    ],
    "missing_ssn": [
        "ssn field missing",
        "social security number not provided",
        "missing identification"
    ],
    "missing_date": [
        "date of injury missing",
        "date field empty",
        "no date provided"
    ],
    "incomplete_form": [
        "required field missing",
        "incomplete information",
        "form not fully filled"
    ],
    "missing_document": [
        "required document missing",
        "supporting document not uploaded",
        "evidence missing"
    ]
}

def predict_deficiencies(document_text: str) -> List[Dict]:
    """
    Predict potential deficiencies in filing
    Uses pattern matching (can be enhanced with ML)
    """
    deficiencies = []
    text_lower = document_text.lower()
    
    for deficiency_type, patterns in DEFICIENCY_PATTERNS.items():
        for pattern in patterns:
            if pattern in text_lower:
                deficiencies.append({
                    "type": deficiency_type,
                    "pattern_matched": pattern,
                    "severity": "critical" if deficiency_type in ["missing_signature", "missing_ssn"] else "warning",
                    "confidence": 0.8
                })
                break
    
    return deficiencies

# ============ Case Outcome Prediction ============

def predict_case_outcome(case_data: dict) -> Dict:
    """
    Predict likely case outcome based on historical data
    Simplified version - can be enhanced with ML model
    """
    case_type = case_data.get("case_type", "")
    has_medical_evidence = case_data.get("has_medical_evidence", False)
    has_employment_records = case_data.get("has_employment_records", False)
    is_pro_se = case_data.get("is_pro_se", False)
    
    # Base probabilities
    outcome = {
        "likely_outcome": "pending",
        "confidence": 0.5,
        "factors": []
    }
    
    # Case type factors
    if case_type == "BLA":
        if has_medical_evidence and has_employment_records:
            outcome["likely_outcome"] = "approved"
            outcome["confidence"] = 0.75
            outcome["factors"].append("Strong medical evidence")
            outcome["factors"].append("Employment records present")
        else:
            outcome["likely_outcome"] = "denied"
            outcome["confidence"] = 0.6
            outcome["factors"].append("Insufficient evidence")
    
    elif case_type == "LHC":
        if has_medical_evidence:
            outcome["likely_outcome"] = "approved"
            outcome["confidence"] = 0.7
            outcome["factors"].append("Medical evidence supports claim")
        else:
            outcome["likely_outcome"] = "pending_review"
            outcome["confidence"] = 0.5
            outcome["factors"].append("Needs medical evaluation")
    
    # Pro se factor
    if is_pro_se:
        outcome["factors"].append("Pro se claimant - may need assistance")
        outcome["confidence"] -= 0.1
    
    return outcome

# ============ Citation Checker ============

VALID_CITATION_PATTERNS = {
    "CFR": r"\d+\s+C\.F\.R\.\s+§?\s*\d+",
    "USC": r"\d+\s+U\.S\.C\.\s+§?\s*\d+",
    "SCOTUS": r"\d+\s+U\.S\.\s+\d+",
    "Circuit": r"\d+\s+F\.\d+d\s+\d+",
    "BLR": r"\d+\s+BLR\s+\d+"
}

import re

def check_citation(citation: str) -> Dict:
    """
    Validate legal citation format
    Returns validation result and suggestions
    """
    result = {
        "valid": False,
        "type": None,
        "suggestions": []
    }
    
    for citation_type, pattern in VALID_CITATION_PATTERNS.items():
        if re.match(pattern, citation):
            result["valid"] = True
            result["type"] = citation_type
            return result
    
    # If invalid, provide suggestions
    result["suggestions"] = [
        "Check CFR format: 20 C.F.R. § 718.202",
        "Check USC format: 33 U.S.C. § 901",
        "Check SCOTUS format: 512 U.S. 267",
        "Check Circuit format: 50 F.3d 238"
    ]
    
    return result

# ============ Legal Research Assistant ============

def search_case_law(query: str, case_type: str = None) -> List[Dict]:
    """
    Search case law database
    Simplified version - integrates with legal research API
    """
    # Mock data - would integrate with real legal research API
    cases = [
        {
            "title": "Director, OWCP v. Greenwich Collieries",
            "citation": "512 U.S. 267 (1994)",
            "court": "Supreme Court",
            "relevance": 0.95,
            "summary": "Burden of proof in Black Lung cases"
        },
        {
            "title": "Consolidation Coal Co. v. Director, OWCP",
            "citation": "50 F.3d 238 (4th Cir. 1995)",
            "court": "4th Circuit",
            "relevance": 0.85,
            "summary": "Medical evidence requirements"
        }
    ]
    
    return cases

def search_regulations(query: str) -> List[Dict]:
    """
    Search regulations database
    """
    # Mock data - would integrate with eCFR API
    regulations = [
        {
            "title": "20 C.F.R. § 718.202",
            "topic": "Pneumoconiosis definition",
            "summary": "Determining existence of pneumoconiosis"
        },
        {
            "title": "20 C.F.R. § 718.204",
            "topic": "Total disability",
            "summary": "Criteria for total disability"
        }
    ]
    
    return regulations
