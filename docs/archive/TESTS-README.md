# Playwright Test Suite for Aureon One

## Overview

This test suite provides comprehensive end-to-end testing for the Aureon One (formerly MediaPlanPro) SaaS application, covering:

- **Marketing pages** - Homepage, product pages, GEO Engine marketing
- **Authentication** - Sign in, sign out, session management
- **Dashboard modules** - Agency OS, Optimiser, Analyser, GEO Engine, Strategiser
- **Regression tests** - Gantt chart specific tests

---

## Prerequisites

- Node.js 18+ 
- npm or yarn

---

## Installation

```bash
# Install Playwright and browsers
npm install -D @playwright/test
npx playwright install

# Install dotenv for environment variables
npm install -D dotenv
```

---

## Configuration

### 1. Create Environment File

Copy the example file and fill in your credentials:

```bash
cp .env.test.example .env.test
```

Edit `.env.test`:

```env
BASE_URL=https://www.mediaplanpro.com
TEST_EMAIL=your-test-user@example.com
TEST_PASSWORD=your-test-password
```

### 2. For Local Development

To test against your local dev server:

```env
BASE_URL=http://localhost:3000
```

---

## Running Tests

### Run All Tests (Headless)

```bash
npx playwright test
```

### Run in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Run Specific Test File

```bash
# Run only marketing tests
npx playwright test tests/marketing/

# Run only auth tests
npx playwright test tests/auth/signin-signout.spec.ts

# Run only Gantt regression tests
npx playwright test tests/regression/gantt.spec.ts
```

### Run Specific Browser

```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# Mobile Chrome
npx playwright test --project=mobile-chrome
```

### Run with UI Mode (Interactive)

```bash
npx playwright test --ui
```

### Debug Mode

```bash
npx playwright test --debug
```

---

## Test Structure

```
tests/
├── marketing/
│   ├── homepage.spec.ts         # Homepage branding, CTAs, navigation
│   ├── product.spec.ts          # Product pages and module links
│   └── geo-engine-marketing.spec.ts  # GEO Engine marketing page
├── auth/
│   └── signin-signout.spec.ts   # Login, logout, session tests
├── dashboard/
│   ├── overview.spec.ts         # Dashboard overview, KPIs
│   ├── agency-os.spec.ts        # Agency OS views and navigation
│   ├── optimiser.spec.ts        # Optimiser dashboard tests
│   ├── analyser.spec.ts         # Analyser tools and features
│   ├── geo-engine.spec.ts       # GEO Engine analysis flow
│   └── strategiser.spec.ts      # Strategiser and templates
├── regression/
│   └── gantt.spec.ts            # Gantt chart specific regressions
└── utils/
    ├── authHelpers.ts           # Login/logout helper functions
    └── navigationHelpers.ts     # Navigation utility functions
```

---

## Viewing Test Results

### HTML Report

After running tests:

```bash
npx playwright show-report
```

### Videos and Screenshots

Failed tests automatically save:
- Screenshots: `test-results/`
- Videos (on failure): `test-results/`

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Quick Sanity Check

For a fast pre-deploy check, run only critical tests:

```bash
npx playwright test tests/auth/signin-signout.spec.ts tests/marketing/homepage.spec.ts tests/dashboard/overview.spec.ts --project=chromium
```

---

## Troubleshooting

### Tests Timing Out

Increase timeout in `playwright.config.ts`:

```ts
timeout: 90000, // 90 seconds
```

### Auth Failures

1. Verify credentials in `.env.test`
2. Check if the login route matches (`/auth/signin` vs `/login`)
3. Update selectors in `authHelpers.ts` if UI changed

### Element Not Found

The selectors use multiple fallbacks. If tests fail:

1. Run in debug mode: `npx playwright test --debug`
2. Use Playwright Inspector to find correct selectors
3. Update the spec file with new selectors

---

## Adding New Tests

1. Create spec file in appropriate folder
2. Import helpers:

```ts
import { test, expect } from '@playwright/test';
import { login } from '../utils/authHelpers';

test.describe('My New Tests', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test('should do something', async ({ page }) => {
        await page.goto('/my-route');
        await expect(page.locator('h1')).toContainText('Expected');
    });
});
```

---

## Test Coverage

| Category | Tests | Status |
|----------|-------|--------|
| Marketing Pages | 15+ | ✅ |
| Authentication | 6 | ✅ |
| Dashboard Overview | 7 | ✅ |
| Agency OS | 7 | ✅ |
| Optimiser | 5 | ✅ |
| Analyser | 7 | ✅ |
| GEO Engine | 7 | ✅ |
| Strategiser | 8 | ✅ |
| Gantt Regression | 8 | ✅ |
