# Contributing to MediaPlanPro

Thank you for your interest in contributing to MediaPlanPro! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git
- PostgreSQL (or SQLite for development)

### Setup Development Environment

1. **Fork the repository**:
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mediaplanpro.git
   cd mediaplanpro
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original/mediaplanpro.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Setup environment**:
   ```bash
   cp .env.example .env
   # Update .env with your configuration
   ```

6. **Run database migrations**:
   ```bash
   npx prisma migrate dev
   ```

7. **Start development server**:
   ```bash
   npm run dev
   ```

## Development Workflow

### 1. Create a Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or changes
- `chore/` - Maintenance tasks

Examples:
- `feature/add-export-pdf`
- `fix/strategy-validation-error`
- `docs/update-api-documentation`

### 2. Make Changes

- Write clean, maintainable code
- Follow coding standards (see below)
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run specific tests
npm test -- __tests__/your-test.test.ts

# Check coverage
npm test -- --coverage

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add PDF export functionality"
```

See [Commit Guidelines](#commit-guidelines) below.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit the PR

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Use enums for constants

```typescript
// Good
interface User {
  id: string;
  email: string;
  role: UserRole;
}

enum UserRole {
  USER = 'USER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN',
}

// Bad
const user: any = { ... };
```

### React Components

- Use functional components with hooks
- Use TypeScript for props
- Keep components small and focused
- Use meaningful component names

```typescript
// Good
interface StrategyFormProps {
  onSubmit: (data: StrategyInput) => void;
  initialData?: StrategyInput;
}

export function StrategyForm({ onSubmit, initialData }: StrategyFormProps) {
  // Component logic
}

// Bad
export function Form(props: any) {
  // Component logic
}
```

### File Organization

```
src/
├── components/
│   ├── strategy/
│   │   ├── strategy-form.tsx
│   │   ├── strategy-list.tsx
│   │   └── index.ts
│   └── ui/
│       ├── button.tsx
│       └── input.tsx
├── lib/
│   ├── services/
│   └── utils/
└── app/
    └── strategies/
        └── page.tsx
```

### Naming Conventions

- **Files**: kebab-case (`strategy-form.tsx`)
- **Components**: PascalCase (`StrategyForm`)
- **Functions**: camelCase (`generateStrategy`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (`StrategyInput`)

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Max line length: 100 characters
- Use trailing commas

```typescript
// Good
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// Bad
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
}
```

### Comments

- Write self-documenting code
- Add comments for complex logic
- Use JSDoc for functions

```typescript
/**
 * Generates a marketing strategy using AI or fallback rules
 * @param input - Strategy input parameters
 * @returns Generated strategy object
 * @throws {ValidationError} If input is invalid
 */
export async function generateStrategy(input: StrategyInput): Promise<Strategy> {
  // Implementation
}
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```bash
feat(export): add PDF export functionality

Add support for exporting strategies to PDF format using pdfkit.
Includes template design and S3 upload integration.

Closes #123

---

fix(auth): resolve token expiration issue

Fix bug where JWT tokens were expiring prematurely due to
incorrect timestamp calculation.

Fixes #456

---

docs(api): update strategy endpoint documentation

Add examples and clarify request/response formats for
strategy creation endpoint.
```

### Rules

- Use present tense ("add" not "added")
- Use imperative mood ("move" not "moves")
- Don't capitalize first letter
- No period at the end
- Reference issues in footer

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Follows coding standards

## Screenshots (if applicable)

## Related Issues
Closes #123
```

### Review Process

1. Automated checks run (tests, linting)
2. Code review by maintainers
3. Address feedback
4. Approval from at least one maintainer
5. Merge to main

## Testing

### Required Tests

- Unit tests for new functions
- Integration tests for new features
- API tests for new endpoints
- UI tests for new components

### Test Coverage

- Maintain 80%+ coverage
- All new code must have tests
- Update existing tests if behavior changes

See [Testing Guide](./TESTING.md) for details.

## Documentation

### What to Document

- New features
- API changes
- Configuration options
- Breaking changes
- Migration guides

### Where to Document

- Code comments (JSDoc)
- README.md (overview)
- docs/ (detailed guides)
- API.md (API reference)
- CHANGELOG.md (version history)

## Getting Help

### Resources

- [Documentation](https://docs.mediaplanpro.com)
- [GitHub Issues](https://github.com/yourusername/mediaplanpro/issues)
- [Discussions](https://github.com/yourusername/mediaplanpro/discussions)

### Questions?

- Open a [Discussion](https://github.com/yourusername/mediaplanpro/discussions)
- Ask in Slack: #mediaplanpro-dev
- Email: dev@mediaplanpro.com

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Annual contributor report

Thank you for contributing to MediaPlanPro! 🎉
