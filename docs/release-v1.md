# Release Notes - v1.0.0 (Aureon One)

## Overview
This release marks the initial launch of **Aureon One**, an AI-powered marketing strategy and operations platform. It includes the core "Strategiser", "Analyser", and "Agency OS" modules, along with a beta release of "Aureon Forge".

## Features

### 1. The Strategiser
*   **AI Strategy Generation**: Generates comprehensive marketing strategies using OpenAI (GPT-4) based on user inputs.
*   **Management**: Create, Edit, Duplicate, and Delete strategies.
*   **Persistence**: All strategies are saved to the database.

### 2. The Analyser
*   **Competitor Analysis**: Deep dive analysis using web scraping and AI synthesis.
*   **History**: View and reload past analysis reports.
*   **Export**: Support for CSV and PDF export of reports.

### 3. Agency OS (White-label)
*   **Client Workspaces**: Manage multiple clients and their distinct projects.
*   **Agency Branding**: Customize the platform with agency logos, colors, and domains.
*   **Project Management**: Create and track projects for each client.

### 4. Aureon Forge (Beta)
*   **Visual Workflow Builder**: Automation engine for marketing tasks.
*   **Status**: Beta release, available for early access testing.
*   **Metrics**: Real-time usage stats and workflow monitoring.

### 5. Safety & Compliance
*   **Feature Guards**: "GEO Engine" and "The Optimiser" are currently set to **Coming Soon** to prevent access to incomplete features while maintaining marketing visibility.

## Known Issues
*   **GEO Engine**: UI is visible but functional access is restricted (by design).
*   **Optimiser**: UI is visible but functional access is restricted (by design).

## Technical Details
*   **Database**: Prisma with Postgres (Neon/Supabase compatible).
*   **Auth**: Clerk authentication.
*   **Environment**: Production-ready configuration.
