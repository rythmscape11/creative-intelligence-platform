# Compliance Control Documentation: SOC 2 Type II & GDPR

## 1. Overview
This document outlines the internal controls and governance frameworks established by Antigravity to ensure compliance with SOC 2 Type II (Trust Services Criteria) and GDPR requirements.

## 2. SOC 2 Trust Services Criteria

### 2.1 Confidentiality
**Control Objective:** Information designated as confidential is protected to meet the entity's objectives.

*   **CC-1 (Data Encryption):** All sensitive customer data (PII, financial records) is encrypted at rest using AES-256 (via Supabase/Postgres TDE) and in transit using TLS 1.3.
*   **CC-2 (Access Control):** Access to production environments is restricted to authorized personnel via Google Cloud IAM with Multi-Factor Authentication (MFA) enabled.
*   **CC-3 (Secret Management):** Application secrets (API keys, database credentials) are never stored in source code. They are managed via Google Secret Manager and injected at runtime.

### 2.2 Processing Integrity
**Control Objective:** System processing is complete, valid, accurate, timely, and authorized.

*   **PI-1 (Input Validation):** All API inputs are validated against strict schemas (e.g., JSON Schema for the `compliance-generator`) to prevent injection attacks and malformed data processing.
*   **PI-2 (Budget Governance):** The `CMS Governor` microservice acts as a proxy to enforce a hard budget limit (₹6,000), ensuring no unauthorized or runaway processing costs occur.
*   **PI-3 (Audit Logging):** All API transactions, including budget checks and generation requests, are logged to Google Cloud Logging for auditability.

## 3. Secure JWT Governance (Authentication & Authorization)

**Control Objective:** Ensure secure management of JSON Web Tokens (JWT) for service-to-service and user authentication.

*   **JWT-1 (Key Rotation):** Signing keys for JWTs are rotated automatically every 90 days. Old keys are retained for a grace period of 7 days to prevent service disruption.
*   **JWT-2 (Signature Validation):** All microservices (e.g., `Execution Linkage`) must validate the JWT signature against the public key endpoint before processing any request.
*   **JWT-3 (Token Expiry):** Access tokens have a short lifespan (1 hour) to minimize the risk of compromised credentials. Refresh tokens are used for session continuity.

## 4. GDPR Compliance

### 4.1 Right to be Forgotten (Data Erasure)
**Control Objective:** Ensure data subjects can request the deletion of their personal data.

*   **GDPR-1 (Deletion Process):** Upon receipt of a deletion request, a specific "tombstone" flag is set on the user record in Supabase. A nightly cron job permanently deletes all associated records (strategies, logs) for users flagged for deletion.
*   **GDPR-2 (Backup Exclusions):** While backups are immutable for 30 days, restored data is checked against a "do not restore" list of deleted user IDs to prevent accidental resurrection of deleted data.

### 4.2 Data Retention Policy
*   **DR-1 (Active Data):** Customer data is retained for the duration of the active subscription plus 60 days grace period.
*   **DR-2 (Logs):** System logs are retained for 365 days for security auditing purposes, after which they are automatically archived to cold storage.
