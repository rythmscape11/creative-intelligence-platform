# MediaPlanPro Blog CMS - API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Blog Posts API](#blog-posts-api)
3. [Categories API](#categories-api)
4. [Tags API](#tags-api)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

---

## Authentication

All API endpoints require authentication via NextAuth session.

### Headers
```
Cookie: next-auth.session-token=<session-token>
```

### Unauthorized Response (401)
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### Forbidden Response (403)
```json
{
  "success": false,
  "error": "Forbidden - Admin access required"
}
```

---

## Blog Posts API

### List Blog Posts

**GET** `/api/blog/posts`

Returns a paginated list of blog posts with filtering and sorting.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 20 | Posts per page |
| `status` | string | No | - | Filter by status (DRAFT, PUBLISHED, SCHEDULED, ARCHIVED) |
| `categoryId` | string | No | - | Filter by category ID |
| `authorId` | string | No | - | Filter by author ID |
| `search` | string | No | - | Search in title, content, excerpt |
| `sortBy` | string | No | createdAt | Sort field (createdAt, updatedAt, publishedAt, title) |
| `sortOrder` | string | No | desc | Sort order (asc, desc) |
| `startDate` | string | No | - | Filter by start date (ISO 8601) |
| `endDate` | string | No | - | Filter by end date (ISO 8601) |

#### Example Request
```bash
GET /api/blog/posts?page=1&limit=20&status=PUBLISHED&sortBy=publishedAt&sortOrder=desc
```

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "clx123abc",
        "title": "10 Marketing Strategies for 2024",
        "slug": "10-marketing-strategies-for-2024",
        "excerpt": "Discover the top marketing strategies...",
        "content": "<h1>10 Marketing Strategies for 2024</h1>...",
        "featuredImage": "https://images.unsplash.com/...",
        "status": "PUBLISHED",
        "publishedAt": "2024-01-15T10:00:00.000Z",
        "createdAt": "2024-01-10T08:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z",
        "author": {
          "id": "user123",
          "name": "John Doe",
          "email": "john@example.com",
          "avatar": "https://..."
        },
        "category": {
          "id": "cat123",
          "name": "Marketing",
          "slug": "marketing",
          "color": "#3B82F6"
        },
        "tags": [
          {
            "id": "tag123",
            "name": "SEO",
            "slug": "seo"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

### Create Blog Post

**POST** `/api/blog/posts`

Creates a new blog post. Requires ADMIN or EDITOR role.

#### Request Body
```json
{
  "title": "10 Marketing Strategies for 2024",
  "slug": "10-marketing-strategies-for-2024",
  "content": "<h1>10 Marketing Strategies for 2024</h1>...",
  "excerpt": "Discover the top marketing strategies...",
  "featuredImage": "https://images.unsplash.com/...",
  "categoryId": "cat123",
  "tagIds": ["tag123", "tag456"],
  "status": "DRAFT",
  "seoTitle": "10 Marketing Strategies for 2024 | Guide",
  "seoDescription": "Discover the top marketing strategies...",
  "publishedAt": null
}
```

#### Validation Rules
- `title`: Required, 1-200 characters
- `slug`: Required, 1-250 characters, lowercase with hyphens, unique
- `content`: Required, 100-100,000 characters
- `excerpt`: Required, 50-300 characters
- `categoryId`: Required
- `tagIds`: Required, minimum 2 tags, maximum 10 tags
- `status`: Optional, defaults to DRAFT
- `publishedAt`: Optional, ISO 8601 datetime

#### Success Response (201)
```json
{
  "success": true,
  "data": {
    "id": "clx123abc",
    "title": "10 Marketing Strategies for 2024",
    ...
  },
  "message": "Blog post created successfully"
}
```

#### Error Response (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 2,
      "type": "array",
      "path": ["tagIds"],
      "message": "Array must contain at least 2 element(s)"
    }
  ]
}
```

---

### Get Single Blog Post

**GET** `/api/blog/posts/[id]`

Returns a single blog post by ID.

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "clx123abc",
    "title": "10 Marketing Strategies for 2024",
    ...
  }
}
```

#### Error Response (404)
```json
{
  "success": false,
  "error": "Blog post not found"
}
```

---

### Update Blog Post

**PATCH** `/api/blog/posts/[id]`

Updates an existing blog post. Editors can only update their own posts.

#### Request Body
Same as Create Blog Post, all fields optional.

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "clx123abc",
    "title": "10 Marketing Strategies for 2024 (Updated)",
    ...
  },
  "message": "Blog post updated successfully"
}
```

---

### Delete Blog Post

**DELETE** `/api/blog/posts/[id]`

Deletes a blog post. Requires ADMIN role.

#### Success Response (200)
```json
{
  "success": true,
  "message": "Blog post deleted successfully"
}
```

---

### Publish Blog Post

**POST** `/api/blog/posts/[id]/publish`

Publishes a draft post or schedules it for future publishing.

#### Request Body
```json
{
  "publishedAt": "2024-01-20T10:00:00.000Z"  // Optional, defaults to now
}
```

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "clx123abc",
    "status": "PUBLISHED",
    "publishedAt": "2024-01-20T10:00:00.000Z"
  },
  "message": "Blog post published successfully"
}
```

---

### Duplicate Blog Post

**POST** `/api/blog/posts/[id]/duplicate`

Creates a copy of an existing post with a unique slug.

#### Success Response (201)
```json
{
  "success": true,
  "data": {
    "id": "clx456def",
    "title": "10 Marketing Strategies for 2024 copy",
    "slug": "10-marketing-strategies-for-2024-copy",
    "status": "DRAFT"
  },
  "message": "Blog post duplicated successfully"
}
```

---

### Auto-Save Blog Post

**POST** `/api/blog/posts/[id]/autosave`

Auto-saves draft changes without logging. Used by the editor every 30 seconds.

#### Request Body
Same as Update Blog Post.

#### Success Response (200)
```json
{
  "success": true,
  "message": "Draft auto-saved"
}
```

---

### Bulk Actions

**POST** `/api/blog/posts/bulk`

Performs bulk actions on multiple posts.

#### Request Body
```json
{
  "action": "publish",  // publish, archive, delete, changeCategory
  "postIds": ["clx123abc", "clx456def"],
  "categoryId": "cat789"  // Required for changeCategory action
}
```

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "count": 2
  },
  "message": "2 posts published successfully"
}
```

---

### Get Related Posts

**GET** `/api/blog/posts/[id]/related`

Returns related posts based on category and tags.

#### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "clx789ghi",
      "title": "SEO Best Practices 2024",
      ...
    }
  ]
}
```

---

## Categories API

### List Categories

**GET** `/api/blog/categories`

Returns all categories with post counts.

#### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "cat123",
      "name": "Marketing",
      "slug": "marketing",
      "description": "Marketing strategies and tips",
      "color": "#3B82F6",
      "_count": {
        "posts": 45
      }
    }
  ]
}
```

---

### Create Category

**POST** `/api/blog/categories`

Creates a new category. Requires ADMIN role.

#### Request Body
```json
{
  "name": "Marketing",
  "slug": "marketing",
  "description": "Marketing strategies and tips",
  "color": "#3B82F6"
}
```

#### Validation Rules
- `name`: Required, 1-100 characters
- `slug`: Required, 1-100 characters, lowercase with hyphens, unique
- `description`: Optional, max 500 characters
- `color`: Optional, hex color format (#RRGGBB)

#### Success Response (201)
```json
{
  "success": true,
  "data": {
    "id": "cat123",
    "name": "Marketing",
    ...
  },
  "message": "Category created successfully"
}
```

---

## Tags API

### List Tags

**GET** `/api/blog/tags`

Returns all tags with post counts.

#### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "tag123",
      "name": "SEO",
      "slug": "seo",
      "_count": {
        "posts": 23
      }
    }
  ]
}
```

---

### Create Tag

**POST** `/api/blog/tags`

Creates a new tag. Requires ADMIN or EDITOR role.

#### Request Body
```json
{
  "name": "SEO",
  "slug": "seo"
}
```

#### Validation Rules
- `name`: Required, 1-50 characters
- `slug`: Required, 1-50 characters, lowercase with hyphens, unique

#### Success Response (201)
```json
{
  "success": true,
  "data": {
    "id": "tag123",
    "name": "SEO",
    "slug": "seo"
  },
  "message": "Tag created successfully"
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Validation Error Response
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "number",
      "path": ["title"],
      "message": "Expected string, received number"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting is implemented. In production, consider:
- 100 requests per minute per user
- 1000 requests per hour per user
- Separate limits for read vs write operations

---

**Last Updated**: October 10, 2025
**Version**: 1.0.0

