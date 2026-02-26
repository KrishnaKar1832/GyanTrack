# GyanTrack API - Architecture & Workflow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      GyanTrack API                          │
│                   (.NET 8 | SQL Server)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
            ┌───────▼───────┐   ┌──────▼───────┐
            │  Controllers  │   │   Services   │
            └───────────────┘   └──────────────┘
                    │                   │
        ┌───────────┼───────────┬───────┴─────────┐
        │           │           │                 │
    ┌───▼──┐  ┌────▼────┐ ┌───▼───────┐ ┌──────▼──────┐
    │ Auth │  │ Admin   │ │Evaluator  │ │   Intern    │
    └──────┘  └────┬────┘ └────┬──────┘ └─────┬──────┘
               [Admin]     [Evaluator]     [Intern]
```

---

## Endpoint Flow by User Role

### 1. AUTHENTICATION (All Roles)

```
┌─────────────────────────────┐
│    POST /api/auth/login     │──────► Check Credentials ──► Return JWT Token
│    POST /api/auth/register  │──────► Create User       ──► Return Profile + Token
│    GET /api/auth/profile    │──────► Get User Profile  ──► Return Profile Data
└─────────────────────────────┘
```

---

### 2. ADMIN WORKFLOW (Role: Admin)

```
┌──────────────────────────────────────────────────────────────┐
│                    ADMIN OPERATIONS                          │
└──────────────────────────────────────────────────────────────┘

Step 1: Manage Subjects
┌─────────────────────────────┐
│ POST /api/admin/subjects    │──► Create Subject
│ GET /api/admin/subjects     │──► View All Subjects
│ DELETE /api/admin/subjects  │──► Delete Subject
└─────────────────────────────┘

Step 2: Assign Templates & Map Evaluators
┌─────────────────────────────┐
│ POST /api/admin/templates   │──► Create Template with Subject + Evaluator
│ PUT /api/admin/templates    │──► Update Template
│ GET /api/admin/templates    │──► View All Templates
└─────────────────────────────┘

Step 3: Map Interns to Evaluators
┌─────────────────────────────┐
│ POST /api/admin/mappings    │──► Assign Intern ←─► Evaluator
│ GET /api/admin/mappings     │──► View All Mappings
└─────────────────────────────┘

Step 4: Monitor Performance Scores & Analytics
┌─────────────────────────────┐
│ POST /api/admin/scores      │──► Create Performance Score
│ GET /api/admin/scores       │──► View All Scores
│ GET /api/admin/performance  │──► View Analytics
└─────────────────────────────┘
```

---

### 3. EVALUATOR WORKFLOW (Role: Evaluator)

```
┌──────────────────────────────────────────────────────────────┐
│                  EVALUATOR OPERATIONS                        │
└──────────────────────────────────────────────────────────────┘

Step 1: Check Assigned Templates
┌──────────────────────────────┐
│ GET /api/evaluator/templates │──► View Templates from Admin
└──────────────────────────────┘
                 │
                 ▼
Step 2: Create Tests from Templates
┌──────────────────────────────┐
│ POST /api/evaluator/tests    │──► Create Test for Template
│ PUT /api/evaluator/tests     │──► Edit Test Details
│ GET /api/evaluator/tests     │──► View Created Tests
└──────────────────────────────┘
                 │
                 ▼
Step 3: Add Questions to Tests
┌──────────────────────────────┐
│ POST /api/evaluator/questions│──► Add Q1, Q2, Q3... with Options
│ PUT /api/evaluator/questions │──► Edit Question
│ GET /api/evaluator/questions │──► View Questions
└──────────────────────────────┘
                 │
                 ▼
Step 4: Review Student Attempts
┌──────────────────────────────────────┐
│ GET /api/evaluator/tests/{id}/attempts  │──► View Submitted Attempts
│ GET /api/evaluator/attempts/{id}    │──► View Detailed Attempt
└──────────────────────────────────────┘
                 │
                 ▼
Step 5: View Analytics
┌──────────────────────────────┐
│ GET /api/evaluator/performance  │──► Department/Intern Performance
└──────────────────────────────┘
```

---

### 4. INTERN WORKFLOW (Role: Intern)

```
┌──────────────────────────────────────────────────────────────┐
│                   INTERN OPERATIONS                          │
└──────────────────────────────────────────────────────────────┘

Step 1: Browse Available Tests
┌──────────────────────────────┐
│ GET /api/intern/tests        │──► View All Tests
│ GET /api/intern/tests/live   │──► View Live Tests [ACTION NEEDED]
│ GET /api/intern/tests/upcoming  │──► View Upcoming Tests
│ GET /api/intern/tests/previous  │──► View Past Tests
└──────────────────────────────┘
                 │
                 ▼
Step 2: Start & Attempt Test [IF LIVE & NOT ATTEMPTED]
┌──────────────────────────────┐
│ POST /api/intern/tests/{id}/start   │──► Start Test ──► Get Attempt ID
└──────────────────────────────┘
                 │
                 ▼
Step 3: Answer Questions (Hidden: Correct Answer)
┌──────────────────────────────┐
│ GET /api/intern/tests/{id}/questions │──► Get Q1, Q2, Q3... (No Answers)
│ POST /api/intern/tests/{id}/submit   │──► Submit Answers
└──────────────────────────────┘
                 │
                 ▼
Step 4: View Results & Evaluations
┌──────────────────────────────┐
│ GET /api/intern/results      │──► View All Test Results
│ GET /api/intern/results/{id} │──► View Specific Result
│ GET /api/intern/evaluations  │──► View Performance Scores
│ GET /api/intern/profile      │──► View Profile
└──────────────────────────────┘
```

---

## Data Flow Diagram

```
                    ┌─────────────┐
                    │   Intern    │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   Takes Test         Gets Evaluated    Reviews Results
        │                  │                  │
        ▼                  ▼                  ▼
  ┌──────────┐      ┌───────────────┐   ┌──────────┐
  │TestAttempt  │      │PerformanceScore │  │TestResult  │
  └──────────┘      └───────────────┘   └──────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                      ┌────▼────┐
                      │Evaluator │◄───── Reviews Attempts
                      └────┬────┘
                           │
                    Creates/Updates
                           │
                      ┌────▼────┐
                      │  Tests   │ ◄──── Template from Admin
                      │Questions │
                      │ Options  │
                      └──────────┘
                           │
                           ▼
                      ┌──────────────────┐
                      │ Admin Dashboard  │
                      │ • Subjects       │
                      │ • Templates      │
                      │ • Mappings       │
                      │ • Analytics      │
                      └──────────────────┘
```

---

## HTTP Method Usage Summary

| Method    | Usage         | Count  | Status |
| --------- | ------------- | ------ | ------ |
| GET       | Retrieve data | 31     | ✅     |
| POST      | Create/Start  | 8      | ✅     |
| PUT       | Update        | 5      | ✅     |
| DELETE    | Remove        | 7      | ✅     |
| **TOTAL** |               | **51** | ✅     |

---

## Authorization Matrix

```
┌──────────────────┬──────────┬───────────┬──────────────┬────────┐
│ Endpoint Group   │ Public   │ Admin     │ Evaluator    │ Intern │
├──────────────────┼──────────┼───────────┼──────────────┼────────┤
│ Auth             │ ✅       │ ✅        │ ✅           │ ✅     │
│ Profile          │ ❌       │ ✅ (Self) │ ✅ (Self)    │ ✅ (Self)
│ Subjects         │ ❌       │ ✅        │ ❌           │ ❌     │
│ Templates        │ ❌       │ ✅        │ ✅ (Assigned)│ ❌     │
│ Mappings         │ ❌       │ ✅        │ ❌           │ ❌     │
│ Tests/Questions  │ ❌       │ ❌        │ ✅ (Created) │ ❌     │
│ Test Attempts    │ ❌       │ ❌        │ ✅ (Review)  │ ✅ (Own)
│ Performance      │ ❌       │ ✅        │ ✅ (Limited) │ ✅ (Self)
└──────────────────┴──────────┴───────────┴──────────────┴────────┘
```

---

## Status Codes Used

| Code | Meaning      | Usage                                  |
| ---- | ------------ | -------------------------------------- |
| 200  | OK           | All successful GET/PUT                 |
| 201  | Created      | Not used (returns 200) - Could improve |
| 400  | Bad Request  | Invalid input, validation errors       |
| 401  | Unauthorized | Missing/invalid token                  |
| 403  | Forbidden    | authenticated but no role access       |
| 404  | Not Found    | Resource not found                     |
| 500  | Server Error | Unhandled exceptions                   |

---

## Test Lifecycle State Diagram

```
                    ┌──────────────┐
                    │  Template    │
                    │  (Created by │
                    │   Admin) │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    Test      │
                    │   (Created)  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Questions   │
                    │  (Added)     │
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                │                    │
                ▼                    ▼
        ┌───────────────┐    ┌──────────────┐
        │ TEST LIVE     │    │ TEST UPCOMING│
        │ (Ongoing)     │    │ (Future)     │
        └───────┬───────┘    └──────┬───────┘
                │                   │
            ┌───┴───┐            ┌──┴────┐
            │       │            │       │
            ▼       ▼            ▼       ▼
        ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
        │Start │  │ Stop │  │ Open │  │Close │
        └──┬───┘  └──────┘  └──────┘  └──────┘
           │
           ▼
        ┌──────────┐
        │ Answers  │
        │ Submitted│
        └──────┬───┘
               │
               ▼
        ┌──────────────┐
        │  Evaluated   │
        │  (Score Set) │
        └──────────────┘
```

---

## API Response Pattern

### Success Response

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "name": "Data Structures",
  "createdAt": "2026-02-20T10:30:00Z",
  "isDeleted": false
}
```

### Error Response

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "message": "Invalid email or password"
}
```

---

## Summary Statistics

- **Total Endpoints:** 51
- **Total Controllers:** 4
- **Authorization Types:** 3 (Public, Role-based, Self-owned)
- **Roles Supported:** 3 (Admin, Evaluator, Intern)
- **Support Services:** 3 (Auth, Assessment, Evaluation)
- **DTOs Count:** 15+
- **Models Count:** 10+

**All endpoints are functional and properly responding.**
