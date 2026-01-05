# MediaPlanPro - AI-Powered Marketing Strategy Platform

A production-ready marketing strategy platform that generates comprehensive marketing strategies using AI and exports them to professional formats (PPTX, DOCX, XLSX).

## 🚀 Features

- **AI-Powered Strategy Generation**: Advanced OpenAI integration with structured prompts
- **Fallback Rules Engine**: Deterministic backup system for reliable results
- **Professional Export Formats**: PPTX, DOCX, and XLSX with customizable templates
- **Content Management System**: Full-featured blog with SEO optimization
- **Role-Based Access Control**: Secure authentication and authorization
- **Performance Optimized**: SSG/ISR, image optimization, and CDN integration
- **Enterprise Security**: AWS S3 integration with signed URLs
- **Background Job Processing**: Redis/Bull queue system for async operations

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Headless UI + custom components
- **State Management**: React Query for server state
- **Authentication**: NextAuth.js with JWT

### Backend
- **Runtime**: Node.js with TypeScript
- **APIs**: REST and GraphQL (Apollo Server)
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: AWS S3 with signed URLs
- **Background Jobs**: Redis + Bull queue system
- **AI Integration**: OpenAI API with structured prompts

### Infrastructure
- **Monitoring**: Sentry for error tracking
- **Analytics**: Google Analytics 4, GTM, Meta Pixel, TikTok Pixel
- **SEO**: Next-SEO, sitemap generation, structured data
- **Testing**: Jest, Playwright for E2E testing
- **CI/CD**: GitHub Actions (configuration included)

## 📋 Prerequisites

- Node.js 18+ and npm 8+
- PostgreSQL 14+
- Redis 6+
- AWS S3 bucket
- OpenAI API key

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd mediaplanpro
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mediaplanpro"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
JWT_SECRET="your-jwt-secret-here"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="mediaplanpro-files"

# Redis
REDIS_URL="redis://localhost:6379"

# Sentry
SENTRY_DSN="your-sentry-dsn"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

### 4. Start Development

```bash
# Start Next.js frontend
npm run dev

# Start backend server (in another terminal)
npm run server:dev
```

Visit `http://localhost:3000` to see the application.

### 5. Docker-Based Local Testing

If you prefer to run everything in Docker (database, Redis, and the app), use the development compose stack:

```bash
# Copy docker env template
cp .env.docker.example .env.docker

# Start the dev stack (Next.js runs with hot reload)
docker compose -f docker-compose.dev.yml up --build

# Tail logs
docker compose -f docker-compose.dev.yml logs -f app

# Stop the stack
docker compose -f docker-compose.dev.yml down
```

The `docker-compose.dev.yml` file mounts your working directory for live reload, uses the new `dev` build target in the `Dockerfile`, and provisions Postgres + Redis automatically for local testing.

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js 13+ app directory
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── layout/         # Layout components
│   │   └── home/           # Home page components
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── hooks/              # Custom React hooks
├── server/                 # Backend server code
│   ├── api/               # API routes and resolvers
│   ├── services/          # Business logic services
│   ├── utils/             # Server utilities
│   └── jobs/              # Background job definitions
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Production Build

```bash
# Build frontend
npm run build

# Build backend
npm run server:build

# Start production server
npm start
```

### Environment Variables

Ensure all production environment variables are set:

- Database connection string
- AWS S3 credentials and bucket
- OpenAI API key
- Redis connection
- Sentry DSN for error tracking
- Analytics tracking IDs

## 📖 API Documentation

### REST API Endpoints

- `POST /api/auth/signin` - User authentication
- `POST /api/strategies` - Create marketing strategy
- `GET /api/strategies/:id` - Get strategy details
- `POST /api/export` - Export strategy to file
- `GET /api/blog/posts` - Get blog posts
- `POST /api/blog/posts` - Create blog post (admin)

### GraphQL API

Access GraphQL playground at `/api/graphql` in development.

Key queries and mutations:
- `strategies` - Query marketing strategies
- `createStrategy` - Generate new strategy
- `exportStrategy` - Export strategy to file format
- `blogPosts` - Query blog posts with filtering

## 🔧 Configuration

### AI Prompts

Customize AI prompts in `server/services/ai/prompts/`:
- `system-prompt.ts` - Base system instructions
- `strategy-prompt.ts` - Marketing strategy generation
- `fallback-rules.ts` - Deterministic fallback logic

### Export Templates

Customize export templates in `server/services/export/templates/`:
- `powerpoint.ts` - PPTX template configuration
- `word.ts` - DOCX template configuration
- `excel.ts` - XLSX template configuration

### SEO Configuration

Configure SEO settings in:
- `next-sitemap.config.js` - Sitemap generation
- `src/lib/seo.ts` - SEO utilities and defaults

## 🔒 Security

- JWT-based authentication with secure token handling
- Role-based access control (RBAC)
- Input validation with Zod schemas
- SQL injection protection via Prisma
- XSS protection with Content Security Policy
- Secure file uploads with signed S3 URLs
- Rate limiting on API endpoints

## 📤 GitHub Push Checklist

Use this quick checklist to push local commits to GitHub safely:

1. **Confirm the remote** (add it if missing):
   ```bash
   git remote add origin https://github.com/rythmscape11/mediaplanpro.git
   git remote -v
   ```
2. **Sync with the latest changes** (avoid conflicts):
   ```bash
   git fetch origin
   git rebase origin/work
   ```
   Replace `work` with the branch you are updating.
3. **Commit your changes** (use a clear message):
   ```bash
   git status
   git add <files>
   git commit -m "Describe the change"
   ```
4. **Push to GitHub**:
   ```bash
   git push -u origin work
   ```
   Use your feature branch name instead of `work` when applicable.

### 🔁 Automate pushing with the helper script

If you prefer a single command that stages, commits, and pushes, use the helper script:

```bash
./scripts/auto-push.sh -m "Your commit message here"
```

Optional flags:

- `-b <branch>`: push to a specific branch (defaults to the current branch)
- `-n`: dry run (prints planned actions without changing anything)
- `-f`: allow an empty commit when no changes are staged

## 📊 Monitoring

- **Error Tracking**: Sentry integration for real-time error monitoring
- **Performance**: Core Web Vitals tracking
- **Analytics**: Google Analytics 4, GTM, Meta Pixel, TikTok Pixel
- **Logging**: Structured logging with Winston
- **Health Checks**: `/api/health` endpoint for monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.mediaplanpro.com](https://docs.mediaplanpro.com)
- **Issues**: [GitHub Issues](https://github.com/mediaplanpro/issues)
- **Email**: support@mediaplanpro.com
- **Discord**: [Community Server](https://discord.gg/mediaplanpro)

---

Built with ❤️ for marketing professionals worldwide.
# mediaplanpro
