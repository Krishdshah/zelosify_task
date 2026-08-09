# 🌐 Zelosify End-to-End System Flow Architecture

This document provides a detailed report explaining the overall application flow, security structure, background processing, and database mapping within the Zelosify application.

---

## 🗺️ Overall Application Flow

The system acts as a bridge between **IT Vendors** (who source and submit candidate profiles) and **Hiring Managers** (who review, shortlist, or reject candidates based on automated, AI-driven recommendations).

```mermaid
sequenceDiagram
    autonumber
    actor V as IT Vendor
    actor HM as Hiring Manager
    participant FE as Next.js Frontend
    participant KC as Keycloak IdP
    participant BE as Express Backend Server
    participant S3 as AWS S3 Storage
    participant AI as AI Recommender Service (Gemini)
    participant DB as PostgreSQL Database

    %% Auth & Initialization
    Note over V, KC: Authentication Flow
    V->>KC: Submits Login Credentials
    KC-->>V: Access & Refresh Tokens
    V->>FE: Accesses Vendor Portal with tokens
    FE->>BE: /api/v1/auth/user (Validates tokens & sets sessions)
    FE->>FE: Middleware Decodes Role & Guards Route
    
    %% Vendor Submission Flow
    Note over V, S3: IT Vendor Upload Pipeline
    V->>FE: Selects Opening & Candidate Resume (PDF/PPTX)
    FE->>BE: POST /api/v1/vendor/openings/:id/presign (Sends filename)
    BE-->>FE: Pre-signed Upload URL + S3 Key (Short-lived backend-generated URL)
    FE->>S3: PUT File upload using Pre-signed URL (No direct AWS credentials shared)
    FE->>BE: POST /api/v1/vendor/openings/:id/upload (Sends s3Key)
    activate BE
    BE->>DB: Write hiringProfile (Status: SUBMITTED, isolation by tenantId)
    BE-->>FE: 201 Created (Background AI processing triggered asynchronously)
    deactivate BE

    %% AI Pipeline
    Note over BE, DB: Asynchronous AI Evaluation
    activate AI
    BE->>AI: Trigger Recommendation (profileId)
    AI->>S3: Download Resume file
    S3-->>AI: File Buffer
    AI->>AI: Extract Text (Verified PDF extraction / slide-by-slide XML tag stripping for PPTX)
    AI->>AI: Sanitize Prompt-Injection attempts
    AI->>AI: Run Tool-Calling Agent Loop
    AI->>AI: Schema Validation (Failed -> Retry up to 3 times)
    AI->>DB: Save Recommendation, Score, Reason, and Latency
    deactivate AI

    %% Hiring Manager Review
    Note over HM, DB: Hiring Manager Review & Decisions
    HM->>FE: Views Opening Candidates
    FE->>BE: GET /api/v1/hiring-manager/openings/:id/candidates
    BE->>DB: Read profiles & AI Recommendations
    DB-->>BE: Profiles & AI recommendation data
    BE-->>FE: Return details (AI score, reason, etc.)
    HM->>FE: Reviews resume & clicks Shortlist / Reject
    FE->>BE: POST /api/v1/hiring-manager/profiles/:id/[shortlist|reject]
    BE->>DB: Update profile status (SHORTLISTED/REJECTED)
    BE-->>FE: 200 Success
```

---

## 1️⃣ Authentication & Security Flow

All interactions within the system are governed by robust authentication and **Role-Based Access Control (RBAC)**.

### A. Authentication & Token Flow
User login and credential verification are handled by Keycloak as the Identity Provider (IdP):
```mermaid
graph TD
    User([User]) -->|1. Submit credentials| Keycloak[Keycloak IdP]
    Keycloak -->|2. Authenticate & Issue Tokens| JWT[Access / Refresh JWTs]
    JWT -->|3. Read by Frontend / passed to Backend| FE[Next.js Frontend]
    JWT -->|4. Authenticate Request via Middleware| BE[Express Backend]
```

### B. Next.js Routing Middleware
The frontend uses Next.js middleware ([middleware.js](file:///c:/Users/Krish%20D%20Shah/Desktop/krishdocs/eval-2db315afdcc3/Zelosify-Frontend/src/middleware.js)) to intercept requests:
- **Token Verification**: Checks cookies for `access_token` and `refresh_token`.
- **Role Detection**: Decodes the JWT payload to extract user roles (`IT_VENDOR`, `HIRING_MANAGER`, `BUSINESS_USER`, etc.) and sets a readable cookie `role`.
- **Route Guarding**:
  - Directs logged-in users from public routes (`/login`, `/register`) to their default home page dashboard.
  - Enforces route protection (e.g., paths starting with `/vendor` are blocked for non-`IT_VENDOR` users; `/hiring-manager` is restricted to `HIRING_MANAGER` only).

### C. Authorization & Tenant Isolation in Request Flows
Every sensitive operation performs step-by-step validation. For example, when a Hiring Manager attempts to access/modify a candidate profile:

```text
Incoming Request
      ↓
[1. JWT Authentication] ──► Validates token signatures & expiration
      ↓
[2. Role Authorization] ──► Checks if role is 'HIRING_MANAGER'
      ↓
[3. Tenant Isolation]   ──► Asserts request.user.tenantId === opening.tenantId
      ↓
[4. Resource Ownership] ──► Asserts opening.hiringManagerId === request.user.id
      ↓
[5. Input Validation]   ──► Validates request query, body, and parameter types
      ↓
[6. Execution]          ──► Passes to Controller -> Service -> DB
```

---

## 2️⃣ IT Vendor Workflow

Vendors submit candidate resumes for open positions scoped strictly to their respective **Tenant**.

1. **Dashboard** (`/vendor`):
   - Displays real-time statistics (e.g., Open Vacancies, Total Submissions, Pending Reviews).
   - Lists the 5 most recent resume submissions with their tracking statuses.
2. **Openings List** (`/vendor/openings`):
   - Shows a paginated list of job openings posted by the client organization's hiring managers.
3. **Opening Detail & Upload** (`/vendor/openings/:id`):
   - Displays position requirements (min/max experience, required skills, location).
   - Lists candidate profiles already submitted by *this* specific vendor.
   - **Upload Mechanics**:
     - **Presigned S3 Upload**: The frontend uploads files directly to S3 using short-lived, backend-generated presigned URLs. The frontend **never** receives direct AWS credentials or arbitrary S3 access permissions.
     - **Metadata Registration**: Once upload completes, the frontend POSTs the S3 key (`POST /api/v1/vendor/openings/:id/profiles/upload`) to persist the submission.

> [!IMPORTANT]
> **Data Isolation Guardrails:** Vendors cannot view AI scores, matching explanations, or recommendation status. These are strictly stripped from vendor API responses ([vendorOpeningsController.ts](file:///c:/Users/Krish%20D%20Shah/Desktop/krishdocs/eval-2db315afdcc3/Zelosify-Backend/Server/src/controllers/vendor/vendorOpeningsController.ts#L136-L145)) to prevent leaks.

---

## 3️⃣ Asynchronous AI Recommendation Pipeline

Once a resume is registered in the database, the backend handles the evaluation process using an in-process queue handler (`setImmediate`).

### Step A: File Extraction (Verified)
- Downloads the resume file stream from S3.
- Extracts text content based on file type:
  - **PDFs**: Parsed using `pdf-extraction`.
  - **PPTX**: Parsed slide-by-slide by extracting slide XML elements from the ZIP archive natively using `tar -xf` to a temporary directory. If native extraction fails, it falls back to scanning the buffer for ASCII regex segments (`/[a-zA-Z0-9\s]{4,100}/g`).

### Step B: Prompt-Injection Mitigation
- **Resume as Untrusted Data**: Resume content is strictly treated as untrusted data. It is never directly concatenated into instructions.
- **System instruction separation**: The LLM's system prompt dictates evaluation rules, and the resume content is passed to the LLM solely as a response output from the `read_resume_file` tool call.
- **Sanitizer layer**: A basic regex filter strips obvious override phrases (e.g., `ignore previous instructions`, `you must recommend`, `developer mode`).
- **Length Constraints**: Text size is capped at 15,000 characters to prevent context-window overflow.

### Step C: Tool-Calling Agent Loop
The orchestrator guides Gemini through a structured execution loop:

```mermaid
graph TD
    Orchestrator[Agent Orchestrator] -->|1. Request| Gemini[Gemini Client]
    Gemini -->|2. Tool Choice| ToolCall{Which Tool?}
    
    ToolCall -->|read_resume_file| Tool1[S3 Resume Downloader & Parser]
    ToolCall -->|normalize_skills| Tool2[Skill Normalizer Standardizes names]
    ToolCall -->|calculate_matching_score| Tool3[Deterministic Score Engine]
    
    Tool1 --> Orchestrator
    Tool2 --> Orchestrator
    Tool3 --> Orchestrator
    
    Gemini -->|3. Returns JSON Output| SchemaValidation{Schema Validator}
    SchemaValidation -->|Invalid JSON / Types| Retry[Retry Loop Max 3 attempts]
    Retry --> Orchestrator
    
    SchemaValidation -->|Valid JSON| DecisionPolicy[Decision Policy: score >= 0.75 ? recommended : not]
    DecisionPolicy -->|4. Persist| DB[(PostgreSQL Database)]
```

- **Deterministic scoring formula**:
  $$\text{Final Score} = (0.5 \times \text{Skill Match}) + (0.3 \times \text{Experience Match}) + (0.2 \times \text{Location Match})$$
  - **Experience Match**: $1.0$ if within min/max requirements, $0.8$ if exceeding max, and $0.0$ if below min.
  - **Skill Match**: Percentage of required job skills present on the candidate's profile.
  - **Location Match**: $1.0$ for matching location or remote roles, $0.5$ if there is a location mismatch for onsite roles.

### Step D: Validation & Execution Policy
- **Schema Validation**: Validates model output JSON against target schemas. If invalid, the orchestrator catches the error and retries the tool loop (up to 3 times) with backoff.
- **Latency & Logging**: Captures total latency (in milliseconds) and outputs structured JSON logs to stdout for observability.
- **Durable Processing Note**: Currently implemented as **asynchronous, in-process processing** using Node's `setImmediate()` callback. It is non-blocking to HTTP requests but does not run in a separate queue container (e.g., BullMQ).

---

## 4️⃣ Status & Decision Lifecycles

The system tracks candidate progress through two separate lifecycles: **Candidate Profile Status** (hiring decision lifecycle) and **AI Recommendation Status** (AI scoring lifecycle).

```mermaid
stateDiagram-v2
    state "Hiring Decision Status" as ProfileStatus {
        [*] --> SUBMITTED
        SUBMITTED --> SHORTLISTED : HM shortlists
        SUBMITTED --> REJECTED : HM rejects
        SHORTLISTED --> REJECTED : HM updates decision
        REJECTED --> SHORTLISTED : HM updates decision
    }

    state "AI Recommendation Status" as AIStatus {
        [*] --> PENDING
        PENDING --> RECOMMENDED : Final Score >= 0.75
        PENDING --> NOT_RECOMMENDED : Final Score < 0.75
    }
```

---

## 5️⃣ Database Schema Mapping

The database schema is managed via Prisma ([schema.prisma](file:///c:/Users/Krish D Shah/Desktop/krishdocs/eval-2db315afdcc3/Zelosify-Backend/Server/prisma/schema.prisma)):

```mermaid
erDiagram
    Tenants ||--o{ User : "has users"
    Tenants ||--o{ Opening : "posts openings"
    Opening ||--o{ hiringProfile : "receives applications"
    User ||--o{ Opening : "manages (Hiring Manager)"

    User {
        String id PK
        String username
        String email
        Role role
        String tenantId FK
        String externalId
        String totpSecret
        Boolean profileComplete
        AuthProvider provider
    }

    Tenants {
        String tenantId PK
        String companyName
        DateTime createdAt
    }

    Opening {
        String id PK
        String tenantId FK
        String title
        String description
        String location
        String contractType
        String hiringManagerId FK
        Int experienceMin
        Int experienceMax
        OpeningStatus status
    }

    hiringProfile {
        Int id PK
        String openingId FK
        String s3Key
        String uploadedBy
        DateTime submittedAt
        ProfileStatus status
        Boolean recommended
        Float recommendationScore
        String recommendationReason
        Float recommendationConfidence
        Boolean isDeleted
    }
```

> [!NOTE]
> **Extensibility Audit note:** Currently, AI results are written directly to fields in the `hiringProfile` table. For future enterprise versions, extracting these fields to a separate `Recommendation` table (capturing `tokenUsage`, `latencyMs`, `modelUsed`, and history) will support richer auditing and multiple agent runs per profile.

---
