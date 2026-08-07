Based on the **assignment PDF** and the **current repository audit**, here's the complete page flow I would implement. This follows an enterprise architecture and minimizes future refactoring.

---

# 🌐 Overall User Flow

```text
Landing
    │
    ▼
Login (Keycloak)
    │
    ▼
Role Detection
    │
    ├──────────────┐
    │              │
    ▼              ▼
Vendor         Hiring Manager
Dashboard      Dashboard
```

---

# 📌 Pages

```
/
├── Login
├── Unauthorized
├── 404

Vendor
├── Dashboard
├── Openings
├── Opening Details
├── Upload Resume
├── Submitted Profiles
├── Profile Details
└── Settings

Hiring Manager
├── Dashboard
├── My Openings
├── Opening Details
├── Candidate List
├── Candidate Details
├── Recommendation Details
└── Settings

Shared
├── Profile
├── Notifications
└── Help
```

---

# 1️⃣ Login Flow

```
/
│
├── Login with Keycloak
│
├── Validate JWT
│
├── Fetch User
│
├── Fetch Tenant
│
└── Redirect Based on Role
```

Routes

```
/
```

or

```
/login
```

---

# 2️⃣ Vendor Flow

## Dashboard

```
/vendor
```

Shows

```
Open Vacancies

Recently Uploaded Profiles

Pending Reviews

Total Submissions
```

---

## Openings List

```
/vendor/openings
```

Table

```
--------------------------------------------
Role

Location

Experience

Contract Type

Hiring Manager

Posted Date

Action(View)
--------------------------------------------
```

API

```
GET /vendor/openings
```

---

## Opening Details

```
/vendor/openings/:id
```

Shows

```
Description

Responsibilities

Required Skills

Experience

Location

Contract

Hiring Manager

Profile Count
```

Buttons

```
Upload Resume
```

---

## Upload Resume

```
/vendor/openings/:id/upload
```

Components

```
Dropzone

Browse

Selected Files

Progress

Delete

Submit
```

Flow

```
Select PDF

↓

Backend

↓

Generate Presigned URL

↓

Upload S3

↓

Save Metadata

↓

Submit
```

---

## Submitted Profiles

```
/vendor/openings/:id/profiles
```

Table

```
Candidate

Filename

Uploaded At

Status

Action
```

Vendor can ONLY see

```
Pending

Submitted
```

NOT

```
AI Score

Recommendation
```

---

## Profile Details

```
/vendor/profile/:id
```

Shows

```
Resume

Filename

Upload Time

Status
```

---

# Vendor Flow Diagram

```
Dashboard

↓

Openings

↓

Opening Details

↓

Upload Resume

↓

Submitted

↓

Done
```

---

# 3️⃣ Hiring Manager Flow

---

## Dashboard

```
/hiring-manager
```

Cards

```
My Openings

Pending Candidates

Recommended

Rejected

Shortlisted
```

---

## My Openings

```
/hiring-manager/openings
```

Table

```
Role

Location

Profiles

Status

Action
```

---

## Opening Details

```
/hiring-manager/openings/:id
```

Shows

```
Description

Skills

Profiles Submitted

Created Date

Actions
```

Below

```
Candidate Table
```

---

## Candidate List

```
/hiring-manager/openings/:id/candidates
```

Columns

```
Candidate

Experience

Recommendation

Score

Confidence

Status

Actions
```

---

## Candidate Details

```
/hiring-manager/candidates/:id
```

Shows

```
Resume Viewer

Extracted Skills

Experience

Education

Location
```

---

## Recommendation Details

Inside candidate page

Card

```
Recommendation

Score

Confidence

Latency

Reason

Matching Skills

Missing Skills
```

Buttons

```
Shortlist

Reject
```

---

# Hiring Manager Flow

```
Dashboard

↓

My Openings

↓

Candidates

↓

Recommendation

↓

Shortlist
```

or

```
Reject
```

---

# 4️⃣ AI Flow

Not a page.

Runs automatically.

```
Resume Uploaded

↓

Store Metadata

↓

Download PDF

↓

Extract Text

↓

LLM

↓

Extract JSON

↓

Normalize Skills

↓

Deterministic Score

↓

Recommendation

↓

Store DB
```

---

# 5️⃣ Backend API Flow

## Vendor

```
GET /vendor/openings

↓

GET /vendor/openings/:id

↓

POST /vendor/openings/:id/presign

↓

POST /vendor/openings/:id/upload
```

---

## Hiring Manager

```
GET /hiring-manager/openings

↓

GET /hiring-manager/openings/:id

↓

GET /hiring-manager/openings/:id/candidates

↓

POST shortlist

↓

POST reject
```

---

# 6️⃣ Database Flow

```
Tenant

│

├── Users

│      │

│      ├── Vendor

│      └── Hiring Manager

│

├── Vacancies

│      │

│      └── Candidate Resume

│                │

│                └── Recommendation
```

---

# 7️⃣ Resume Upload Flow

```
Select Resume

↓

Validate

↓

Generate Presigned URL

↓

Upload S3

↓

Save DB

↓

Queue AI

↓

Recommendation Generated

↓

Hiring Manager Dashboard Updated
```

---

# 8️⃣ Authentication Flow

```
Login

↓

Keycloak

↓

JWT

↓

Middleware

↓

RBAC

↓

Tenant Filter

↓

Controller
```

---

# 9️⃣ AI Internal Flow

```
PDF

↓

pdf-extraction

↓

Plain Text

↓

Gemini/Groq

↓

JSON Validation

↓

Normalize Skills

↓

Matching Engine

↓

Score Engine

↓

Recommendation

↓

Database
```

---

# 🔟 Overall Application Flow

```text
                    ┌────────────────────────────┐
                    │        Keycloak Login      │
                    └──────────────┬─────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
          IT Vendor Dashboard          Hiring Manager Dashboard
                    │                             │
                    ▼                             ▼
             View Openings                View My Openings
                    │                             │
                    ▼                             ▼
            Opening Details              Opening Details
                    │                             │
                    ▼                             ▼
             Upload Resume               View Candidates
                    │                             │
                    ▼                             ▼
         Generate Presigned URL          AI Recommendation
                    │                             │
                    ▼                             ▼
              Upload to S3               Score + Explanation
                    │                             │
                    ▼                             ▼
          Save Resume Metadata        Shortlist / Reject
                    │
                    ▼
          AI Processing Pipeline
                    │
                    ▼
     PDF → Extract → LLM → Normalize
                    │
                    ▼
        Deterministic Scoring Engine
                    │
                    ▼
         Store Recommendation in DB
                    │
                    ▼
       Visible Only to Hiring Manager
```

## Estimated Implementation Scope

| Layer                   |                   Count |
| ----------------------- | ----------------------: |
| Frontend Pages          |                  **12** |
| Backend APIs            |                **8–10** |
| Prisma Models           |                 **5–7** |
| AI Services             |                   **5** |
| Middleware              |                 **3–4** |
| Upload Pipeline         | **1 complete workflow** |
| Authentication Flow     |                   **1** |
| Recommendation Pipeline |                   **1** |

This structure aligns with the assignment requirements while keeping responsibilities clearly separated across frontend, backend, AI services, and infrastructure.
