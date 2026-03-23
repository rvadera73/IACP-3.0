"""
Database Seeder for IACP 3.0
Populates database with mock data from existing prototype

Run with: python backend/seed_data.py
"""

from datetime import date
import models
import database

def seed_data():
    """Seed database with mock data"""
    db = database.SessionLocal()
    
    try:
        # Check if already seeded
        existing = db.query(models.Person).first()
        if existing:
            print("⚠️  Database already has data. Clearing...")
            db.query(models.DocketEvent).delete()
            db.query(models.Filing).delete()
            db.query(models.Case).delete()
            db.query(models.User).delete()
            db.query(models.Person).delete()
            db.commit()
        
        print("📦 Seeding database with mock data...\n")
        
        # ========== PEOPLE ==========
        print("Creating People...")
        
        people_data = [
            # Claimants
            {
                "id": "person-claimant-1",
                "person_type": "individual",
                "first_name": "Robert",
                "last_name": "Martinez",
                "email": "r.martinez@email.com",
                "phone": "(412) 555-0123",
                "address_line_1": "456 Miner Street",
                "city": "Pittsburgh",
                "state": "PA",
                "zip_code": "15202"
            },
            {
                "id": "person-claimant-2",
                "person_type": "individual",
                "first_name": "James",
                "last_name": "Thompson",
                "email": "j.thompson@email.com",
                "phone": "(412) 555-0789",
                "address_line_1": "321 Coal Road",
                "city": "Pittsburgh",
                "state": "PA",
                "zip_code": "15203"
            },
            {
                "id": "person-claimant-3",
                "person_type": "individual",
                "first_name": "Maria",
                "last_name": "Santos",
                "email": "m.santos@email.com",
                "phone": "(212) 555-0321",
                "address_line_1": "654 Harbor View",
                "city": "New York",
                "state": "NY",
                "zip_code": "10001"
            },
            # Employers
            {
                "id": "person-employer-1",
                "person_type": "organization",
                "organization_name": "Harbor Freight Inc.",
                "email": "legal@harborfreight.com",
                "phone": "(412) 555-5000",
                "address_line_1": "500 Industrial Park",
                "city": "Pittsburgh",
                "state": "PA",
                "zip_code": "15204"
            },
            {
                "id": "person-employer-2",
                "person_type": "organization",
                "organization_name": "Apex Coal Mining",
                "email": "legal@apexcoal.com",
                "phone": "(412) 555-6000",
                "address_line_1": "600 Mining Road",
                "city": "Pittsburgh",
                "state": "PA",
                "zip_code": "15205"
            },
            # Attorneys
            {
                "id": "person-attorney-1",
                "person_type": "individual",
                "first_name": "John",
                "last_name": "Doe",
                "email": "john.doe@legalaid.org",
                "phone": "(412) 555-1000",
                "address_line_1": "100 Legal Way",
                "city": "Pittsburgh",
                "state": "PA",
                "zip_code": "15201",
                "bar_number": "PA12345"
            },
            {
                "id": "person-attorney-2",
                "person_type": "individual",
                "first_name": "Jane",
                "last_name": "Smith",
                "email": "jane.smith@hansenlaw.com",
                "phone": "(412) 555-2000",
                "address_line_1": "200 Law Street",
                "city": "Pittsburgh",
                "state": "PA",
                "zip_code": "15202",
                "bar_number": "PA23456"
            }
        ]
        
        people = []
        for p in people_data:
            person = models.Person(**p)
            db.add(person)
            people.append(person)
            print(f"  ✓ {p.get('first_name', p.get('organization_name', ''))} {p.get('last_name', '')}")
        
        db.commit()
        print(f"✅ Created {len(people)} people\n")
        
        # ========== USERS (Internal Staff) ==========
        print("Creating Users (Internal Staff)...")
        
        users_data = [
            {
                "id": "user-judge-1",
                "person_id": None,  # Will link after creating
                "role": "alj",
                "office": "Pittsburgh",
                "google_oauth_id": "google-judge-1"
            },
            {
                "id": "user-judge-2",
                "person_id": None,
                "role": "alj",
                "office": "New York",
                "google_oauth_id": "google-judge-2"
            },
            {
                "id": "user-clerk-1",
                "person_id": "person-clerk-1",
                "role": "docket_clerk",
                "office": "Pittsburgh",
                "google_oauth_id": "google-clerk-1"
            }
        ]
        
        # Create judge persons first
        judge_persons = [
            models.Person(
                id="person-judge-1",
                person_type="individual",
                first_name="Sarah",
                last_name="Jenkins",
                email="sarah.jenkins@dol.gov"
            ),
            models.Person(
                id="person-judge-2",
                person_type="individual",
                first_name="Michael",
                last_name="Ross",
                email="michael.ross@dol.gov"
            ),
            models.Person(
                id="person-clerk-1",
                person_type="individual",
                first_name="Dana",
                last_name="Clerk",
                email="dana.clerk@dol.gov"
            )
        ]
        
        for jp in judge_persons:
            db.add(jp)
        
        db.commit()
        
        users_data[0]["person_id"] = "person-judge-1"
        users_data[1]["person_id"] = "person-judge-2"
        
        users = []
        for u in users_data:
            user = models.User(**u)
            db.add(user)
            users.append(user)
            print(f"  ✓ {u['role']} - {u['office']}")
        
        db.commit()
        print(f"✅ Created {len(users)} users\n")
        
        # ========== CASES ==========
        print("Creating Cases...")
        
        cases_data = [
            {
                "id": "case-1",
                "docket_number": "2026-BLA-00011",
                "case_type": "BLA",
                "title": "Robert Martinez v. Harbor Freight Inc.",
                "current_phase": "docketed",
                "current_status": "awaiting_assignment",
                "assigned_judge_id": None,
                "docketed_date": date(2026, 3, 15),
                "statutory_deadline": date(2026, 12, 10),
                "sla_status": "green"
            },
            {
                "id": "case-2",
                "docket_number": "2026-BLA-00012",
                "case_type": "BLA",
                "title": "James Thompson v. Apex Coal Mining",
                "current_phase": "assigned",
                "current_status": "discovery",
                "assigned_judge_id": "user-judge-1",
                "docketed_date": date(2026, 3, 1),
                "statutory_deadline": date(2026, 11, 14),
                "sla_status": "green"
            },
            {
                "id": "case-3",
                "docket_number": "2025-LHC-00128",
                "case_type": "LHC",
                "title": "Maria Santos v. Atlantic Dockworkers",
                "current_phase": "hearing",
                "current_status": "hearing_in_progress",
                "assigned_judge_id": "user-judge-2",
                "docketed_date": date(2025, 6, 2),
                "statutory_deadline": None,
                "sla_status": "green"
            }
        ]
        
        cases = []
        for c in cases_data:
            case = models.Case(**c)
            db.add(case)
            cases.append(case)
            print(f"  ✓ {c['docket_number']} - {c['title']}")
        
        db.commit()
        print(f"✅ Created {len(cases)} cases\n")
        
        # ========== FILINGS ==========
        print("Creating Filings...")
        
        filings_data = [
            {
                "id": "filing-1",
                "intake_id": "INT-2026-00089",
                "case_id": "case-1",
                "filing_type": "claim",
                "status": "accepted",
                "submitted_by": "person-claimant-1",
                "description": "LS-203 Claim Form for Black Lung Benefits",
                "ai_score": 98.0
            },
            {
                "id": "filing-2",
                "intake_id": "INT-2026-00090",
                "case_id": "case-2",
                "filing_type": "claim",
                "status": "accepted",
                "submitted_by": "person-claimant-2",
                "description": "LS-203 Claim Form with medical evidence",
                "ai_score": 95.0
            },
            {
                "id": "filing-3",
                "intake_id": "INT-2026-00091",
                "case_id": None,
                "filing_type": "claim",
                "status": "pending",
                "submitted_by": "person-claimant-3",
                "description": "Longshore claim - pending review",
                "ai_score": 75.0
            }
        ]
        
        filings = []
        for f in filings_data:
            filing = models.Filing(**f)
            db.add(filing)
            filings.append(filing)
            print(f"  ✓ {f['intake_id']} - {f['filing_type']} ({f['status']})")
        
        db.commit()
        print(f"✅ Created {len(filings)} filings\n")
        
        # ========== DOCKET EVENTS ==========
        print("Creating Docket Events...")
        
        events_data = [
            # Case 1 events
            {
                "id": "event-1",
                "case_id": "case-1",
                "sequence_number": 1,
                "event_type": "CASE_REFERRED",
                "event_data": '{"referring_agency": "owcp", "referral_date": "2026-03-15"}',
                "actor_type": "system"
            },
            {
                "id": "event-2",
                "case_id": "case-1",
                "sequence_number": 2,
                "event_type": "FILING_RECEIVED",
                "event_data": '{"filing_type": "claim", "channel": "efs_electronic"}',
                "actor_type": "external_party"
            },
            {
                "id": "event-3",
                "case_id": "case-1",
                "sequence_number": 3,
                "event_type": "CASE_DOCKETED",
                "event_data": '{"docket_number": "2026-BLA-00011", "method": "auto"}',
                "actor_type": "system"
            },
            # Case 2 events
            {
                "id": "event-4",
                "case_id": "case-2",
                "sequence_number": 1,
                "event_type": "CASE_DOCKETED",
                "event_data": '{"docket_number": "2026-BLA-00012", "method": "auto"}',
                "actor_type": "system"
            },
            {
                "id": "event-5",
                "case_id": "case-2",
                "sequence_number": 2,
                "event_type": "JUDGE_ASSIGNED",
                "event_data": '{"judge_id": "user-judge-1", "method": "smart"}',
                "actor_type": "internal_user"
            }
        ]
        
        events = []
        for e in events_data:
            event = models.DocketEvent(**e)
            db.add(event)
            events.append(event)
        
        db.commit()
        print(f"✅ Created {len(events)} docket events\n")
        
        # ========== SUMMARY ==========
        print("="*60)
        print("📊 SEEDING COMPLETE")
        print("="*60)
        print(f"✅ People:     {len(people)}")
        print(f"✅ Users:      {len(users)}")
        print(f"✅ Cases:      {len(cases)}")
        print(f"✅ Filings:    {len(filings)}")
        print(f"✅ Events:     {len(events)}")
        print("="*60)
        print("\n🎉 Database seeded successfully!")
        print("\n📝 Test the API:")
        print("   - GET /api/v1/cases           (3 cases)")
        print("   - GET /api/v1/filings         (3 filings)")
        print("   - GET /api/v1/intake/queue    (1 pending)")
        print("   - GET /api/v1/judges/suggest  (2 judges)")
        print("\n🌐 Open http://localhost:8000/docs")
        print("\n💡 Seeded SQLite/local backend models with Phase 1 prototype data.")
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ ERROR: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
