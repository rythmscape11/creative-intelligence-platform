# Architecture Overview

## System Architecture

MediaPlanPro is built using a modern, scalable architecture with the following components:

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │    React     │  │  Tailwind    │      │
│  │   Frontend   │  │  Components  │  │     CSS      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Next.js    │  │   Express    │  │   NextAuth   │      │
│  │  API Routes  │  │    Server    │  │     Auth     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Service Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Strategy    │  │   Export     │  │     Blog     │      │
│  │  Processor   │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     S3       │  │  Monitoring  │  │   Logger     │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │    Redis     │  │    AWS S3    │      │
│  │   Database   │  │    Cache     │  │   Storage    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   OpenAI     │  │    Sentry    │  │   Vercel     │      │
│  │     API      │  │  Monitoring  │  │   Hosting    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Component Library**: Radix UI
- **State Management**: React Context + Hooks
- **Form Handling**: React Hook Form + Zod

### Backend
- **API Framework**: Next.js API Routes + Express.js
- **Authentication**: NextAuth.js (JWT)
- **ORM**: Prisma
- **Validation**: Zod schemas
- **Background Jobs**: Bull Queue + Redis

### Database
- **Primary Database**: PostgreSQL 15
- **Cache**: Redis 7
- **File Storage**: AWS S3

### External Services
- **AI**: OpenAI GPT-4
- **Monitoring**: Sentry
- **Hosting**: Vercel
- **CDN**: Cloudflare

## Core Components

### 1. Strategy Builder

**Purpose**: Generate marketing strategies using AI or rules engine

**Flow**:
```
User Input → Validation → AI Generation → Fallback Rules → Storage → Response
```

**Key Files**:
- `src/lib/services/strategy-processor.ts`
- `src/lib/services/openai-client.ts`
- `server/api/strategies.ts`

### 2. Export System

**Purpose**: Export strategies to PPTX, DOCX, XLSX formats

**Flow**:
```
Export Request → Job Queue → File Generation → S3 Upload → Notification
```

**Key Files**:
- `src/lib/services/export-service.ts`
- `src/lib/services/s3-service.ts`
- `server/jobs/export-jobs.ts`

### 3. Blog CMS

**Purpose**: Content management with SEO optimization

**Features**:
- WYSIWYG editor
- Categories and tags
- SEO metadata
- Scheduled publishing

**Key Files**:
- `server/api/blog.ts`
- `src/lib/services/seo-service.ts`
- `src/components/blog/`

### 4. Authentication & Authorization

**Purpose**: Secure user authentication and role-based access control

**Roles**:
- `USER`: Basic access
- `EDITOR`: Content management
- `ADMIN`: Full system access

**Key Files**:
- `src/app/api/auth/[...nextauth]/route.ts`
- `server/middleware/auth.ts`

## Data Models

### User
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  role          Role      @default(USER)
  strategies    Strategy[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Strategy
```prisma
model Strategy {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  businessName      String
  industry          String
  targetAudience    String
  budget            Float
  generatedStrategy Json
  exports           Export[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### Export
```prisma
model Export {
  id          String       @id @default(cuid())
  strategyId  String
  strategy    Strategy     @relation(fields: [strategyId], references: [id])
  format      ExportFormat
  status      ExportStatus @default(PENDING)
  fileUrl     String?
  createdAt   DateTime     @default(now())
  completedAt DateTime?
}
```

## API Architecture

### REST API Design

**Endpoint Structure**:
```
/api/
  ├── auth/
  │   ├── signin
  │   ├── signup
  │   └── signout
  ├── strategies/
  │   ├── GET    /           (list)
  │   ├── POST   /           (create)
  │   ├── GET    /:id        (get)
  │   ├── PATCH  /:id        (update)
  │   └── DELETE /:id        (delete)
  ├── export/
  │   ├── POST   /           (create export)
  │   ├── GET    /:id        (get status)
  │   └── GET    /:id/download
  ├── blog/
  │   ├── posts/
  │   ├── categories/
  │   └── tags/
  └── admin/
      ├── users/
      ├── stats/
      └── storage/
```

### Response Format

**Success**:
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

**Error**:
```json
{
  "success": false,
  "error": "ErrorType",
  "message": "Human-readable message",
  "details": {...}
}
```

## Security Architecture

### Authentication Flow

```
1. User submits credentials
2. Server validates credentials
3. JWT token generated
4. Token stored in httpOnly cookie
5. Subsequent requests include token
6. Server validates token on each request
```

### Security Measures

- **Authentication**: JWT with httpOnly cookies
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Zod schemas on all inputs
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: SameSite cookies
- **Rate Limiting**: API request throttling
- **SQL Injection**: Prisma ORM parameterized queries
- **Secrets Management**: Environment variables

## Performance Optimization

### Caching Strategy

**Levels**:
1. **Browser Cache**: Static assets (1 year)
2. **CDN Cache**: Pages and API responses (1 hour)
3. **Redis Cache**: Database queries (5 minutes)
4. **Application Cache**: In-memory data (1 minute)

### Database Optimization

- **Indexes**: On frequently queried fields
- **Connection Pooling**: Prisma connection pool
- **Query Optimization**: Efficient Prisma queries
- **Read Replicas**: For scaling reads

### Frontend Optimization

- **Code Splitting**: Dynamic imports
- **Image Optimization**: Next.js Image component
- **SSG/ISR**: Static generation where possible
- **Bundle Size**: Tree shaking and minification

## Monitoring & Observability

### Metrics Collected

- **Application Metrics**: Request rate, response time, error rate
- **Business Metrics**: Strategies created, exports generated
- **Infrastructure Metrics**: CPU, memory, disk usage
- **User Metrics**: Active users, session duration

### Logging

**Levels**:
- `DEBUG`: Development debugging
- `INFO`: General information
- `WARN`: Warning conditions
- `ERROR`: Error conditions

**Destinations**:
- Console (development)
- Sentry (production errors)
- CloudWatch (production logs)

## Scalability

### Horizontal Scaling

- **Application**: Multiple Next.js instances behind load balancer
- **Database**: Read replicas for read-heavy operations
- **Cache**: Redis cluster for distributed caching
- **Storage**: S3 for unlimited file storage

### Vertical Scaling

- Increase server resources as needed
- Database instance upgrades
- Redis memory expansion

## Deployment Architecture

### Production Environment

```
┌─────────────┐
│  Cloudflare │  (CDN + DDoS Protection)
└──────┬──────┘
       │
┌──────▼──────┐
│   Vercel    │  (Application Hosting)
└──────┬──────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
┌──────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
│  AWS RDS    │ │  Redis   │ │   AWS S3    │
│ PostgreSQL  │ │  Cloud   │ │   Storage   │
└─────────────┘ └──────────┘ └─────────────┘
```

## Future Enhancements

- GraphQL API alongside REST
- WebSocket support for real-time updates
- Microservices architecture for specific domains
- Event-driven architecture with message queues
- Multi-region deployment for global availability
