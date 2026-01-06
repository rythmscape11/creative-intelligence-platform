# API Reference

## Overview
MediaPlanPro API uses REST conventions with JSON request/response bodies.
All authenticated endpoints require Clerk session tokens.

---

## Authentication

### Headers
```
Authorization: Bearer <clerk_session_token>
```

Or use Clerk's automatic session handling in Next.js.

---

## Checkout & Subscriptions

### Create Product Subscription
```
POST /api/checkout/product
```

**Request:**
```json
{
  "product": "AGENCY_OS",
  "tier": "PRO",
  "interval": "monthly",
  "currency": "usd"
}
```

**Response:**
```json
{
  "success": true,
  "subscriptionId": "sub_xxx",
  "checkoutOptions": {
    "key": "rzp_xxx",
    "subscription_id": "sub_xxx",
    "name": "MediaPlanPro",
    "description": "Agency OS Pro - Monthly",
    "prefill": { "name": "John", "email": "john@example.com" }
  }
}
```

### Get User Subscriptions
```
GET /api/checkout/product
```

**Response:**
```json
{
  "subscriptions": [
    {
      "product": "AGENCY_OS",
      "tier": "PRO",
      "status": "ACTIVE",
      "interval": "monthly",
      "currentPeriodEnd": "2024-02-15T00:00:00.000Z"
    }
  ]
}
```

### Upgrade/Downgrade
```
PUT /api/subscriptions/manage
```

**Request:**
```json
{
  "product": "AGENCY_OS",
  "action": "upgrade",
  "newTier": "AGENCY"
}
```

### Cancel Subscription
```
DELETE /api/subscriptions/manage?product=AGENCY_OS
```

---

## Admin APIs

### Get Analytics (Admin Only)
```
GET /api/admin/analytics
```

**Response:**
```json
{
  "totalMRR": 12500,
  "totalARR": 150000,
  "activeSubscriptions": 156,
  "churnRate": 2.5,
  "arpu": 80.13,
  "products": {
    "AGENCY_OS": { "mrr": 5000, "activeStarter": 30, "activePro": 20 },
    "OPTIMISER": { "mrr": 4000, ... }
  }
}
```

### Get Users (Admin Only)
```
GET /api/admin/users?page=1&limit=20&search=john
```

**Response:**
```json
{
  "users": [
    {
      "id": "user_xxx",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "subscriptions": [
        { "product": "AGENCY_OS", "tier": "PRO", "status": "ACTIVE" }
      ]
    }
  ],
  "total": 150,
  "totalPages": 8
}
```

---

## Tracking APIs

### Track Page View
```
POST /api/tracking/event
```

**Request:**
```json
{
  "event": "page_view",
  "pathname": "/agency/dashboard",
  "product": "AGENCY_OS"
}
```

### Track Feature Usage
```
POST /api/tracking/feature
```

**Request:**
```json
{
  "feature": "export_pdf",
  "product": "AGENCY_OS",
  "metadata": { "fileSize": 1024 }
}
```

### Track Session
```
POST /api/tracking/session
```

**Request:**
```json
{
  "eventType": "login"
}
```

---

## Webhooks

### Razorpay Webhook
```
POST /api/webhooks/razorpay
```

Handled events:
- `subscription.activated`
- `subscription.charged`
- `subscription.cancelled`
- `payment.captured`
- `payment.failed`

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error
