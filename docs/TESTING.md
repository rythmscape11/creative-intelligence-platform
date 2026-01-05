# Testing Guide

## Overview

MediaPlanPro uses a comprehensive testing strategy with multiple test types to ensure code quality and reliability.

## Test Types

### 1. Unit Tests
Test individual functions and components in isolation.

**Location**: `__tests__/lib/`, `__tests__/services/`

**Example**:
```typescript
import { StrategyProcessor } from '@/lib/services/strategy-processor';

describe('StrategyProcessor', () => {
  it('should generate strategy with valid input', async () => {
    const processor = new StrategyProcessor();
    const result = await processor.generateStrategy({
      businessName: 'Test Corp',
      industry: 'Technology',
      // ...
    });
    
    expect(result).toHaveProperty('executive_summary');
    expect(result).toHaveProperty('marketing_channels');
  });
});
```

### 2. Integration Tests
Test multiple components working together.

**Location**: `__tests__/integration/`

**Example**:
```typescript
describe('Strategy Creation Flow', () => {
  it('should create strategy and export to PPTX', async () => {
    // Create strategy
    const strategy = await createStrategy(data);
    
    // Create export
    const exportJob = await createExport(strategy.id, 'PPTX');
    
    // Wait for completion
    await waitForExport(exportJob.id);
    
    // Verify file exists
    expect(exportJob.fileUrl).toBeDefined();
  });
});
```

### 3. API Tests
Test API endpoints and responses.

**Location**: `__tests__/api/`

**Example**:
```typescript
import request from 'supertest';
import app from '@/server';

describe('POST /api/strategies', () => {
  it('should create strategy with valid data', async () => {
    const response = await request(app)
      .post('/api/strategies')
      .set('Authorization', `Bearer ${token}`)
      .send(validStrategyData);
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

### 4. UI Component Tests
Test React components.

**Location**: `__tests__/ui/`

**Example**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { StrategyForm } from '@/components/strategy/strategy-form';

describe('StrategyForm', () => {
  it('should submit form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<StrategyForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Business Name'), {
      target: { value: 'Test Corp' }
    });
    
    fireEvent.click(screen.getByText('Generate Strategy'));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
```

### 5. End-to-End Tests
Test complete user workflows.

**Location**: `__tests__/e2e/`

**Example**:
```typescript
describe('Complete Strategy Workflow', () => {
  it('should create, view, and export strategy', async () => {
    // Login
    await login('user@example.com', 'password');
    
    // Navigate to strategy builder
    await page.goto('/strategies/new');
    
    // Fill form
    await page.fill('[name="businessName"]', 'Test Corp');
    // ...
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Wait for strategy
    await page.waitForSelector('.strategy-result');
    
    // Export
    await page.click('button:has-text("Export to PPTX")');
    
    // Verify download
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toContain('.pptx');
  });
});
```

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suite
```bash
# Unit tests
npm test -- __tests__/lib
npm test -- __tests__/services

# Integration tests
npm test -- __tests__/integration

# API tests
npm test -- __tests__/api

# UI tests
npm test -- __tests__/ui

# E2E tests
npm test -- __tests__/e2e
```

### Watch Mode
```bash
npm test -- --watch
```

### Coverage
```bash
npm test -- --coverage
```

### Specific Test File
```bash
npm test -- __tests__/services/strategy-processor.test.ts
```

### Specific Test Case
```bash
npm test -- --testNamePattern="should generate strategy"
```

## Test Configuration

### Jest Configuration
`jest.config.js`:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'server/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Test Setup
`jest.setup.js`:
```javascript
// Mock environment variables
process.env.DATABASE_URL = 'file:./test.db';
process.env.NEXTAUTH_SECRET = 'test-secret';

// Mock external services
jest.mock('@/lib/services/openai-client');
jest.mock('@sentry/nextjs');
```

## Writing Tests

### Best Practices

1. **Follow AAA Pattern**:
   ```typescript
   it('should do something', () => {
     // Arrange
     const input = { ... };
     
     // Act
     const result = doSomething(input);
     
     // Assert
     expect(result).toBe(expected);
   });
   ```

2. **Use Descriptive Names**:
   ```typescript
   // Good
   it('should return 401 when user is not authenticated', () => {});
   
   // Bad
   it('test auth', () => {});
   ```

3. **Test One Thing**:
   ```typescript
   // Good
   it('should validate email format', () => {});
   it('should validate email uniqueness', () => {});
   
   // Bad
   it('should validate email', () => {
     // Tests both format and uniqueness
   });
   ```

4. **Use Test Fixtures**:
   ```typescript
   const validUser = {
     email: 'test@example.com',
     name: 'Test User',
     password: 'password123',
   };
   ```

5. **Clean Up After Tests**:
   ```typescript
   afterEach(async () => {
     await prisma.user.deleteMany();
     await prisma.strategy.deleteMany();
   });
   ```

### Mocking

#### Mock Functions
```typescript
const mockFn = jest.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue(Promise.resolve('value'));
```

#### Mock Modules
```typescript
jest.mock('@/lib/services/openai-client', () => ({
  OpenAIClient: jest.fn().mockImplementation(() => ({
    generateStrategy: jest.fn().mockResolvedValue(mockStrategy),
  })),
}));
```

#### Mock Prisma
```typescript
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  })),
}));
```

## Coverage Goals

### Target Coverage
- **Statements**: 80%+
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+

### View Coverage Report
```bash
npm test -- --coverage
open coverage/lcov-report/index.html
```

## Continuous Integration

Tests run automatically on:
- Every push to `main` or `develop`
- Every pull request
- Before deployment

### GitHub Actions
```yaml
- name: Run tests
  run: npm test -- --coverage
  
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Debugging Tests

### VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Chrome DevTools
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Performance Testing

### Load Testing
```bash
# Install k6
brew install k6

# Run load test
k6 run scripts/load-test.js
```

### Example Load Test
```javascript
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function() {
  let res = http.get('https://mediaplanpro.com/api/health');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

## Test Data

### Factories
```typescript
export const userFactory = (overrides = {}) => ({
  email: 'test@example.com',
  name: 'Test User',
  password: 'password123',
  role: 'USER',
  ...overrides,
});

export const strategyFactory = (overrides = {}) => ({
  businessName: 'Test Corp',
  industry: 'Technology',
  targetAudience: 'Small businesses',
  budget: 50000,
  ...overrides,
});
```

## Troubleshooting

### Common Issues

**Tests timing out**:
```typescript
it('should complete', async () => {
  // Increase timeout
}, 10000); // 10 seconds
```

**Database conflicts**:
```typescript
beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`;
});
```

**Async issues**:
```typescript
// Use async/await
await expect(asyncFn()).resolves.toBe(value);

// Or use done callback
it('should work', (done) => {
  asyncFn().then(result => {
    expect(result).toBe(value);
    done();
  });
});
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)
