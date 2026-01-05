# API Documentation

## Overview

MediaPlanPro provides a comprehensive REST API for managing marketing strategies, blog content, user management, and more.

**Base URL**: `https://mediaplanpro.com/api`

**Authentication**: JWT tokens via NextAuth.js

## Authentication

### Login

```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Register

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

## Strategy API

### Create Strategy

```http
POST /api/strategies
Authorization: Bearer {token}
Content-Type: application/json

{
  "businessName": "Acme Corp",
  "industry": "Technology",
  "targetAudience": "Small businesses",
  "budget": 50000,
  "objectives": ["Brand Awareness", "Lead Generation"],
  "challenges": "Limited marketing budget",
  "timeframe": "6 months"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "strategy_123",
    "businessName": "Acme Corp",
    "generatedStrategy": {
      "executive_summary": "...",
      "target_audience": {...},
      "marketing_channels": [...],
      "budget_allocation": {...},
      "timeline": {...},
      "kpis": [...]
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Strategy

```http
GET /api/strategies/{id}
Authorization: Bearer {token}
```

### List Strategies

```http
GET /api/strategies?page=1&limit=20
Authorization: Bearer {token}
```

### Update Strategy

```http
PATCH /api/strategies/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "businessName": "Updated Name"
}
```

### Delete Strategy

```http
DELETE /api/strategies/{id}
Authorization: Bearer {token}
```

## Export API

### Create Export Job

```http
POST /api/export
Authorization: Bearer {token}
Content-Type: application/json

{
  "strategyId": "strategy_123",
  "format": "PPTX"
}
```

**Formats**: `PPTX`, `DOCX`, `XLSX`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "export_123",
    "strategyId": "strategy_123",
    "format": "PPTX",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Export Status

```http
GET /api/export/{id}
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "export_123",
    "status": "COMPLETED",
    "fileUrl": "https://s3.amazonaws.com/bucket/export_123.pptx",
    "downloadUrl": "https://mediaplanpro.com/api/export/export_123/download"
  }
}
```

### Download Export

```http
GET /api/export/{id}/download
Authorization: Bearer {token}
```

Returns the file as a download.

## Blog API

### List Posts

```http
GET /api/blog/posts?page=1&limit=20&status=PUBLISHED
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status (DRAFT, PUBLISHED, SCHEDULED, ARCHIVED)
- `category`: Filter by category slug
- `tag`: Filter by tag slug
- `search`: Search in title and content

### Get Post

```http
GET /api/blog/posts/{slug}
```

### Create Post (Editor/Admin only)

```http
POST /api/blog/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "How to Create a Marketing Strategy",
  "content": "...",
  "excerpt": "...",
  "status": "DRAFT",
  "categoryId": "category_123",
  "tags": ["marketing", "strategy"]
}
```

### Update Post

```http
PATCH /api/blog/posts/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "PUBLISHED"
}
```

### Delete Post

```http
DELETE /api/blog/posts/{id}
Authorization: Bearer {token}
```

## Admin API

### Get Dashboard Stats

```http
GET /api/admin/stats
Authorization: Bearer {token}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "active": 45,
      "newThisMonth": 12
    },
    "content": {
      "totalPosts": 25,
      "publishedPosts": 18
    },
    "strategies": {
      "total": 89,
      "thisMonth": 23
    }
  }
}
```

### List Users

```http
GET /api/admin/users?page=1&limit=20&role=USER
Authorization: Bearer {token}
```

### Update User Role

```http
PATCH /api/admin/users/{id}/role
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "EDITOR"
}
```

### Delete User

```http
DELETE /api/admin/users/{id}
Authorization: Bearer {token}
```

## Health & Monitoring

### Health Check

```http
GET /api/health
```

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "checks": {
    "database": {
      "status": "healthy"
    },
    "memory": {
      "status": "healthy",
      "heapUsed": "150MB"
    }
  }
}
```

### Metrics

```http
GET /api/metrics
```

Returns system metrics in JSON or Prometheus format.

## Error Responses

All API endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message",
  "details": {
    "field": "Specific error details"
  }
}
```

### HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

## Pagination

List endpoints support pagination:

**Request**:
```http
GET /api/strategies?page=2&limit=20
```

**Response**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

## Webhooks

MediaPlanPro supports webhooks for real-time notifications:

### Events

- `strategy.created`
- `strategy.updated`
- `export.completed`
- `export.failed`
- `post.published`

### Webhook Payload

```json
{
  "event": "strategy.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "strategy_123",
    "businessName": "Acme Corp"
  }
}
```

## SDK & Libraries

Official SDKs:
- JavaScript/TypeScript: `@mediaplanpro/sdk`
- Python: `mediaplanpro-python`
- Ruby: `mediaplanpro-ruby`

## Support

For API support:
- Email: api@mediaplanpro.com
- Documentation: https://docs.mediaplanpro.com
- Status: https://status.mediaplanpro.com
