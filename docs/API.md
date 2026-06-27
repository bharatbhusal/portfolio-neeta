# API Reference

## Base URL

- **Development:** `http://localhost:3000`
- **Production:** `https://neetabhusal.vercel.app`

All API routes are prefixed with `/api`.

## Response Format

All endpoints return a standard envelope:

```typescript
// Success
{ "success": true, "data": T }

// Error
{ "success": false, "error": { "message": string, "code"?: string, "details"?: any } }
```

---

## Authentication

### POST /api/auth/signup
Register the admin user (disabled after first signup via `DISABLE_ONBOARDING=true`).

**Request:**
```json
{ "username": "admin", "password": "securePassword123" }
```
**Response:** `{ "success": true, "data": { "username": "admin" } }`

---

### POST /api/auth/login
Authenticate and receive JWT in httpOnly cookie.

**Request:**
```json
{ "username": "admin", "password": "securePassword123" }
```
**Response:** `{ "success": true, "data": { "username": "admin" } }`

**Sets cookie:** `nb_auth=<JWT>; httpOnly; path=/; maxAge=2592000; sameSite=lax; secure (in production)`

---

### POST /api/auth/logout
Clear auth cookie.

**Response:** `{ "success": true }`

---

### GET /api/auth/status
Check authentication status.

**Response:**
```json
{ "success": true, "data": { "authenticated": true } }
```

---

## Projects

### GET /api/projects
List projects with search, filter, sort, pagination.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `search` | string | — | Search by title (text search) |
| `category` | string | — | Filter by category |
| `sort` | string | `newest` | `newest`, `oldest`, `a-z`, `z-a` |
| `page` | number | `1` | Page number |
| `limit` | number | `12` | Items per page |

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "_id": "...",
        "key": "project-slug",
        "title": "Project Name",
        "category": "branding",
        "story": "Description...",
        "year": "2024",
        "featured": false,
        "tags": ["design", "branding"],
        "client": "Client Name",
        "link": "https://...",
        "imageUrl": "https://res.cloudinary.com/...",
        "downloadUrl": "https://res.cloudinary.com/...?watermark",
        "createdAt": "ISO date",
        "updatedAt": "ISO date"
      }
    ],
    "total": 25,
    "page": 1,
    "totalPages": 3
  }
}
```

---

### POST /api/projects
Create a new project. Requires authentication.

**Request:**
```json
{
  "key": "project-slug",
  "title": "Project Name",
  "category": "branding",
  "story": "Project story...",
  "description": "Short description...",
  "year": "2024",
  "featured": false,
  "tags": ["design", "branding"],
  "client": "Client Name",
  "link": "https://example.com"
}
```

**Response:** `{ "success": true, "data": { <project> } }`

---

### PATCH /api/projects/[id]
Update an existing project. Requires authentication.

**Request:** (partial — only send fields to update)
```json
{
  "title": "Updated Title",
  "featured": true
}
```

**Response:** `{ "success": true, "data": { <updated project> } }`

---

## Images

### GET /api/images
Proxy/transform images from Cloudinary.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `publicId` | string | — | Cloudinary public ID |
| `width` | number | — | Resize width |
| `height` | number | — | Resize height |
| `crop` | string | `fill` | Crop mode |
| `quality` | number | `75` | Image quality (1-100) |
| `format` | string | `auto` | Output format |
| `download` | boolean | `false` | Adds watermark + forces download |

**Response:** `302 Redirect` to Cloudinary URL with transforms applied.

> When `download=true`, a "Neeta Bhusal" text watermark is overlaid.

---

### GET /api/images/signature
Get a signed upload signature for Cloudinary. Requires authentication.

**Response:**
```json
{
  "success": true,
  "data": {
    "signature": "abc123...",
    "timestamp": 1234567890,
    "cloudName": "your-cloud",
    "apiKey": "your-api-key",
    "folder": "your-folder"
  }
}
```

---

## Project Requests (Logo Design)

### GET /api/requests
List project requests. Requires authentication.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `search` | string | — | Search by name, email, or brandName |
| `status` | string | `all` | `all`, `pending`, `reviewed`, `accepted`, `declined` |
| `sort` | string | `newest` | `newest`, `oldest`, `brand`, `status` |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page |

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [ { <ProjectRequest> } ],
    "total": 50,
    "page": 1,
    "totalPages": 5
  }
}
```

### POST /api/requests
Submit a logo design request. No authentication required.

**Request:** (partial schema shown)
```json
{
  "requestType": "logo_design",
  "name": "Client Name",
  "email": "client@example.com",
  "phone": "+1234567890",
  "brandName": "Brand Name",
  "businessDescription": "Description...",
  "targetAudience": "Audience...",
  "brandKeywords": ["Modern", "Minimal"],
  "logoFeeling": ["Trust", "Creativity"],
  "logoType": "combination_logo",
  "colors": "Blue and white",
  "symbols": "Abstract shapes",
  "inspiration": "Reference URLs or description",
  "usage": ["Website", "Instagram"],
  "fileFormats": ["PNG", "SVG", "PDF"],
  "additionalNotes": "Any extra info..."
}
```

**Response:** `{ "success": true, "data": { <ProjectRequest> } }`

Triggers 2 emails:
1. **Admin alert** — new request received
2. **Client confirmation** — request received with ID

---

### PATCH /api/requests/[id]
Update request status. Requires authentication.

**Request:**
```json
{
  "status": "reviewed"
}
```

**Status values:** `pending`, `reviewed`, `accepted`, `declined`

**Response:** `{ "success": true, "data": { <updated request> } }`

Triggers email to client notifying them of the status change.

---

## Validation Schemas (Zod)

All input validation lives in `lib/validators.ts`. Key schemas:

| Schema | Validates |
|--------|-----------|
| `loginSchema` | username (min 1), password (min 6) |
| `signupSchema` | username (min 3), password (min 6) |
| `projectSchema` | key (required, regex: lowercase + hyphens), title (required), category (required), year (pattern), featured (boolean), tags (array of strings) |
| `projectUpdateSchema` | Same as projectSchema but all optional |
| `requestSchema` | requestType (enum), name, email, brandName (all required), phone (optional), brandKeywords (array from enum), logoFeeling (array from enum), logoType (enum), usage (array from enum), fileFormats (array from enum) |
| `requestUpdateSchema` | status (enum: pending/reviewed/accepted/declined) |

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success (GET, PATCH) |
| `201` | Created (POST) |
| `302` | Redirect (image proxy) |
| `400` | Validation error (Zod) |
| `401` | Unauthorized (missing/invalid JWT) |
| `404` | Not found |
| `409` | Conflict (duplicate project key) |
| `500` | Internal server error |
