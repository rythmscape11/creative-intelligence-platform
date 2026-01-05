# Admin Panel API Reference

Complete API documentation for the MediaPlanPro Admin Panel.

---

## Authentication

All admin endpoints require:
- Valid session (authenticated user)
- `ADMIN` role (unless specified otherwise)

**Headers:**
```
Cookie: next-auth.session-token=<token>
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized (wrong role)
- `429 Too Many Requests` - Rate limit exceeded

---

## User Management

### List Users

```http
GET /api/admin/users?page=1&limit=20&search=&role=
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)
- `search` (optional) - Search by name or email
- `role` (optional) - Filter by role (ADMIN, EDITOR, USER)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "_count": {
        "strategies": 5,
        "blogPosts": 2
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

### Get User Details

```http
GET /api/admin/users/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "avatar": "https://...",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z",
    "_count": {
      "strategies": 5,
      "blogPosts": 2
    }
  }
}
```

---

### Change User Role

```http
PATCH /api/admin/users/:id/role
```

**Request Body:**
```json
{
  "role": "EDITOR"
}
```

**Validation:**
- `role` must be one of: `USER`, `EDITOR`, `ADMIN`
- Cannot change own role
- Logs audit event: `USER_ROLE_CHANGED`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "EDITOR"
  },
  "message": "User role updated successfully"
}
```

---

### Delete User

```http
DELETE /api/admin/users/:id
```

**Restrictions:**
- Cannot delete own account
- Cannot delete other admin users
- Cascades: deletes user's strategies, blog posts, activities, analytics

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Category Management

### List Categories

```http
GET /api/admin/blog/categories
```

**Authorization:** ADMIN or EDITOR

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat-id",
      "name": "Technology",
      "slug": "technology",
      "description": "Tech posts",
      "_count": {
        "posts": 5
      }
    }
  ]
}
```

---

### Create Category

```http
POST /api/admin/blog/categories
```

**Authorization:** ADMIN or EDITOR

**Request Body:**
```json
{
  "name": "Technology",
  "slug": "technology",
  "description": "Tech posts"
}
```

**Validation:**
- `name` required, min 1 character
- `slug` required, min 1 character, must be unique
- `description` optional

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cat-id",
    "name": "Technology",
    "slug": "technology",
    "description": "Tech posts"
  },
  "message": "Category created successfully"
}
```

---

### Update Category

```http
PUT /api/admin/blog/categories/:id
```

**Authorization:** ADMIN or EDITOR

**Request Body:**
```json
{
  "name": "Technology",
  "slug": "technology",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cat-id",
    "name": "Technology",
    "slug": "technology",
    "description": "Updated description"
  },
  "message": "Category updated successfully"
}
```

---

### Delete Category

```http
DELETE /api/admin/blog/categories/:id
```

**Authorization:** ADMIN only

**Restrictions:**
- Cannot delete category with posts
- Must reassign posts first

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## Tag Management

### List Tags

```http
GET /api/admin/blog/tags
```

**Authorization:** ADMIN or EDITOR

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "tag-id",
      "name": "AI",
      "slug": "ai",
      "_count": {
        "posts": 3
      }
    }
  ]
}
```

---

### Create Tag

```http
POST /api/admin/blog/tags
```

**Authorization:** ADMIN or EDITOR

**Request Body:**
```json
{
  "name": "AI",
  "slug": "ai"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "tag-id",
    "name": "AI",
    "slug": "ai"
  },
  "message": "Tag created successfully"
}
```

---

### Update Tag

```http
PUT /api/admin/blog/tags/:id
```

**Authorization:** ADMIN or EDITOR

**Request Body:**
```json
{
  "name": "Artificial Intelligence",
  "slug": "ai"
}
```

---

### Delete Tag

```http
DELETE /api/admin/blog/tags/:id
```

**Authorization:** ADMIN only

**Note:** Tags are automatically unlinked from posts (many-to-many relationship)

---

## Strategy Management

### List Strategies

```http
GET /api/admin/strategies?page=1&limit=50
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "strategy-id",
      "userId": "user-id",
      "input": "...",
      "output": "...",
      "generatedBy": "AI",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "user": {
        "id": "user-id",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

---

### Delete Strategy

```http
DELETE /api/admin/strategies/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Strategy deleted successfully"
}
```

---

## System Settings

### Get Settings

```http
GET /api/admin/settings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "siteName": "MediaPlanPro",
    "siteDescription": "...",
    "maintenanceMode": false,
    "allowRegistration": true
  }
}
```

---

### Update Settings

```http
PUT /api/admin/settings
```

**Request Body:**
```json
{
  "siteName": "MediaPlanPro",
  "maintenanceMode": false,
  "allowRegistration": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully"
}
```

---

## System Health

### Get Health Status

```http
GET /api/admin/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-01-01T00:00:00.000Z",
    "uptime": {
      "seconds": 86400,
      "formatted": "1d 0h 0m 0s"
    },
    "database": {
      "status": "healthy",
      "latency": 5,
      "stats": {
        "users": 100,
        "strategies": 500,
        "blogPosts": 50,
        "activities": 1000
      }
    },
    "activity": {
      "last24Hours": 150
    },
    "memory": {
      "rss": "150 MB",
      "heapTotal": "100 MB",
      "heapUsed": "80 MB",
      "external": "5 MB"
    },
    "performance": {
      "totalLatency": 10
    },
    "environment": {
      "nodeVersion": "v20.0.0",
      "platform": "darwin",
      "env": "production"
    }
  }
}
```

---

## Analytics

### Get Analytics Data

```http
GET /api/admin/analytics?period=30
```

**Query Parameters:**
- `period` (optional) - Number of days (default: 30)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "days": 30,
      "startDate": "2024-12-01T00:00:00.000Z",
      "endDate": "2025-01-01T00:00:00.000Z"
    },
    "users": {
      "total": 100,
      "active": 50,
      "new": 10,
      "byRole": [
        { "role": "USER", "count": 80 },
        { "role": "EDITOR", "count": 15 },
        { "role": "ADMIN", "count": 5 }
      ]
    },
    "content": {
      "totalPosts": 50,
      "published": 40,
      "drafts": 10,
      "created": 5
    },
    "strategies": {
      "total": 500,
      "created": 50,
      "byType": [
        { "type": "AI", "count": 400 },
        { "type": "MANUAL", "count": 100 }
      ]
    },
    "activity": {
      "total": 1000,
      "recent": 150,
      "byAction": [
        { "action": "LOGIN", "count": 500 },
        { "action": "STRATEGY_CREATED", "count": 300 }
      ]
    },
    "trends": {
      "dailyActivities": [
        { "date": "2025-01-01", "count": 50 }
      ],
      "dailyRegistrations": [
        { "date": "2025-01-01", "count": 2 }
      ],
      "dailyStrategies": [
        { "date": "2025-01-01", "count": 10 }
      ]
    },
    "topUsers": [
      {
        "_count": 100,
        "userId": "user-id",
        "user": {
          "id": "user-id",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "USER"
        }
      }
    ]
  }
}
```

---

## Rate Limits

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Admin Read | 100 requests | 1 minute |
| Admin Write | 30 requests | 1 minute |
| Admin Delete | 10 requests | 1 minute |
| Auth Login | 5 requests | 15 minutes |
| Auth Register | 3 requests | 1 hour |
| Strategy Generate | 10 requests | 1 hour |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200000
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Not authorized (wrong role) |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## Audit Logging

All admin actions are logged with:
- `userId` - User who performed the action
- `action` - Action type (e.g., USER_ROLE_CHANGED)
- `entityType` - Type of entity (USER, BLOG_POST, etc.)
- `entityId` - ID of the entity
- `details` - JSON object with additional details
- `ipAddress` - Client IP address
- `userAgent` - Client user agent
- `timestamp` - When the action occurred

**Action Types:**
- `USER_CREATED`, `USER_UPDATED`, `USER_DELETED`, `USER_ROLE_CHANGED`
- `CATEGORY_CREATED`, `CATEGORY_UPDATED`, `CATEGORY_DELETED`
- `TAG_CREATED`, `TAG_UPDATED`, `TAG_DELETED`
- `STRATEGY_DELETED`
- `SYSTEM_CONFIG_CHANGED`

---

**Last Updated:** 2025-10-12  
**Version:** 1.0.0

