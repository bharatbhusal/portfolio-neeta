# API Routes

API routes are located in `app/api/`. They handle data transformation, filtering, and validation.

## `/api/projects` — Projects List Endpoint

**Location**: `app/api/projects/route.ts`

**HTTP Method**: `GET`

**Purpose**: Return filtered and sorted list of projects; used by components and external tools

**Response Type**: `ProjectsData`

**Caching**:

```javascript
export const revalidate = 60 * 60; // 1 hour ISR
```

**Response Headers**:

```
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
```

### Query Parameters

| Parameter  | Type                  | Default     | Description                                             |
| ---------- | --------------------- | ----------- | ------------------------------------------------------- |
| `featured` | `"true"` \| `"false"` | `undefined` | Filter to featured projects only                        |
| `category` | string                | `undefined` | Filter by category (e.g., "Web", "Design")              |
| `tag`      | string                | `undefined` | Filter by tag (e.g., "React", "Node.js")                |
| `year`     | number                | `undefined` | Filter by year                                          |
| `client`   | `"true"` \| `"false"` | `undefined` | Filter to client projects only (`.client` field exists) |

### Example Requests

**Get all projects (sorted: featured first, then alphabetical by key)**:

```bash
curl "https://bharatbhusal.com/api/projects"
```

**Get featured projects only**:

```bash
curl "https://bharatbhusal.com/api/projects?featured=true"
```

**Get projects from 2024**:

```bash
curl "https://bharatbhusal.com/api/projects?year=2024"
```

**Get client projects (projects with `.client` field)**:

```bash
curl "https://bharatbhusal.com/api/projects?client=true"
```

**Get web projects with React tag**:

```bash
curl "https://bharatbhusal.com/api/projects?category=Web&tag=React"
```

### Response Format

**Status Code**: `200 OK`

**Body**:

```json
{
	"projects": [
		{
			"key": "project_key.jpeg",
			"title": "Project Title",
			"description": "...",
			"shortDescription": "...",
			"image": "cloudinary-public-id",
			"category": "Web",
			"tags": ["React", "Next.js"],
			"year": 2024,
			"featured": true,
			"client": "Client Name"
		}
	]
}
```

### Sorting

**Always applied** (after filtering):

1. Featured projects first (`featured === true`)
2. Within each group, alphabetically by `key`

**Example order**:

```
featured = true:
  - dv_niketan.jpeg
  - gitam_university.jpeg
  - kusma_candela.jpeg

featured = false:
  - awesome_project.jpeg
  - beautiful_design.jpeg
  - creative_app.jpeg
```

### Implementation Details

```typescript
export async function GET(request: Request) {
	// 1. Read projects.json
	const projectsData = await fetchJson<ProjectsData>(
		"/public/data/projects.json",
	);

	// 2. Parse query parameters
	const url = new URL(request.url);
	const featured =
		url.searchParams.get("featured") === "true";
	const category = url.searchParams.get("category");
	const tag = url.searchParams.get("tag");
	const year = url.searchParams.get("year");
	const client = url.searchParams.get("client") === "true";

	// 3. Filter
	let filtered = projectsData.projects;
	if (featured)
		filtered = filtered.filter((p) => p.featured);
	if (client) filtered = filtered.filter((p) => p.client);
	if (category)
		filtered = filtered.filter(
			(p) => p.category === category,
		);
	if (tag)
		filtered = filtered.filter((p) => p.tags.includes(tag));
	if (year)
		filtered = filtered.filter(
			(p) => p.year === parseInt(year),
		);

	// 4. Sort (featured first, then key alphabetical)
	filtered.sort((a, b) => {
		if (a.featured !== b.featured) return b.featured ? 1 : -1;
		return a.key.localeCompare(b.key);
	});

	// 5. Return
	return Response.json(
		{ projects: filtered },
		{
			headers: {
				"Cache-Control":
					"public, s-maxage=3600, stale-while-revalidate=86400",
			},
		},
	);
}
```

**No error handling** — if query parameter is invalid, it's treated as falsy and ignored.

---

## `/api/images` — Image Metadata Endpoint

**Location**: `app/api/images/route.ts`

**HTTP Method**: `GET`

**Purpose**: Return image metadata for Cloudinary integration; includes public IDs, dimensions, and URLs

**Response Type**: Array of image objects

**Caching**: Same as `/api/projects` (1 hour ISR)

### Response Format

**Status Code**: `200 OK`

**Body**:

```json
{
	"images": [
		{
			"key": "project_key.jpeg",
			"title": "Project Title",
			"publicId": "cloudinary-public-id",
			"url": "https://res.cloudinary.com/.../portfolio-project-name.jpg",
			"thumbnailUrl": "https://res.cloudinary.com/.../c_fill,w_300,h_225/portfolio-project-name.jpg",
			"year": 2024
		}
	]
}
```

### Query Parameters

Same as `/api/projects`:

- `featured=true|false`
- `category=string`
- `tag=string`
- `year=number`
- `client=true|false`

### Implementation Details

Maps projects to Cloudinary image URLs:

```typescript
export async function GET(request: Request) {
	const projectsData = await fetchJson<ProjectsData>(
		"/public/data/projects.json",
	);

	// Apply same filtering as /api/projects
	let filtered = projectsData.projects;
	// [filtering logic...]

	// Transform to image metadata
	const images = filtered.map((project) => ({
		key: project.key,
		title: project.title,
		publicId: project.image,
		url: `https://res.cloudinary.com/your-cloud-name/image/upload/${project.image}.jpg`,
		thumbnailUrl: `https://res.cloudinary.com/your-cloud-name/image/upload/c_fill,w_300,h_225/${project.image}.jpg`,
		year: project.year,
	}));

	return Response.json({ images });
}
```

**Note**: Exact Cloudinary Cloud Name must be configured in `next.config.ts` (see [PATTERNS.md](./PATTERNS.md#cloudinary-integration))

---

## Usage Examples in Components

### In Server Component

```typescript
// app/projects/page.tsx
import { fetchJson } from '@/lib/data';

const ProjectsPage = async () => {
  const response = await fetch('http://localhost:3000/api/projects?featured=true', {
    next: { revalidate: 3600 }
  });
  const data = await response.json();

  return (
    <div>
      {data.projects.map(project => (
        <ProjectCard key={project.key} project={project} />
      ))}
    </div>
  );
};
```

### Direct Data Loading

```typescript
// Preferred: Load JSON directly, no HTTP roundtrip
import { fetchJson } from "@/lib/data";

const projectsData = await fetchJson<ProjectsData>(
	"/public/data/projects.json",
);

// Filter in component
const clientProjects = projectsData.projects
	.filter((p) => p.client)
	.sort((a, b) => {
		if (a.featured !== b.featured) return b.featured ? 1 : -1;
		return a.key.localeCompare(b.key);
	});
```

### In Client Component (Next.js 16+)

```typescript
'use client';
import { useEffect, useState } from 'react';

export function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/projects?featured=true')
      .then(res => res.json())
      .then(data => setProjects(data.projects));
  }, []);

  return (
    <div>
      {projects.map(p => <ProjectCard key={p.key} project={p} />)}
    </div>
  );
}
```

---

## Error States

**Current Implementation**: No error handling

**Behavior**:

- Invalid JSON → `JSON.parse()` throws → 500 error
- Missing file → `readFile()` throws → 500 error
- Invalid query params → treated as falsy, request continues

**Future Improvements**:

- Add try-catch blocks
- Return 400 for invalid query params
- Return 404 for missing projects.json
- Log errors to monitoring service

---

## Performance Notes

### Cache Invalidation

**Automatic (ISR)**:

- Revalidates every 1 hour
- `s-maxage=3600` for CDN cache
- `stale-while-revalidate=86400` for stale content fallback

**Manual**:

- Call `revalidatePath('/api/projects')` or `revalidateTag('projects')`
- Requires Next.js deployment with ISR support (Vercel, etc.)

### Parallel Requests

```typescript
// Fetch both in parallel
const [projects, contact] = await Promise.all([
	fetchJson<ProjectsData>("/public/data/projects.json"),
	fetchJson<ContactData>("/public/data/contact.json"),
]);
```

Reduces total time from 2 × (load time) to 1 × (load time)

---

## Security & Rate Limiting

**Current**: No authentication, no rate limiting

**Public Endpoint**: These APIs are intentionally public:

- Used by external tools, analytics, etc.
- No sensitive data exposed
- Cloudinary URLs are public

**Future Hardening** (if needed):

- Add API key requirement
- Implement rate limiting middleware
- Add CORS restrictions
- Sign Cloudinary URLs
