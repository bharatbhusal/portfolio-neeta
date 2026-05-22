# Data Structure & Schema

All content lives in `/public/data/` as JSON files. These are the source of truth for the portfolio.

## site.json

**Purpose**: Global site metadata (name, description, URLs)

**Location**: `/public/data/site.json`

**Type Definition**: `SiteData` in `types/portfolio.ts`

**Schema**:

```typescript
interface SiteData {
	name: string; // Site owner name
	tagline: string; // Short description
	description: string; // Long description (for SEO meta)
	baseUrl: string; // Base domain URL (e.g., "https://bharatbhusal.com")
	email: string; // Contact email
	url: string; // Full homepage URL
	title: string; // Page title for browser tab
	keywords: string[]; // SEO keywords
	ogImage: string; // Open Graph image URL (for social sharing)
}
```

**Example**:

```json
{
	"name": "Bharat Bhusal",
	"tagline": "Full-stack developer & designer",
	"description": "Portfolio of Bharat Bhusal...",
	"baseUrl": "https://bharatbhusal.com",
	"email": "contact@bharatbhusal.com",
	"url": "https://bharatbhusal.com",
	"title": "Bharat Bhusal - Portfolio",
	"keywords": ["developer", "design", "web"],
	"ogImage": "https://res.cloudinary.com/.../og.jpg"
}
```

**Used By**:

- `app/layout.tsx` — Metadata generation
- `lib/seo.ts` — SEO utilities
- Footer component — Contact email

---

## projects.json

**Purpose**: Master list of all portfolio projects (featured, sorting, filtering)

**Location**: `/public/data/projects.json`

**Type Definition**: `ProjectsData` and `Project` in `types/portfolio.ts`

**Schema**:

```typescript
interface Project {
	key: string; // Unique identifier; also used for URL routing
	// Format: "name_of_project.jpeg"
	// Used in /projects/[projectKey]

	title: string; // Display name
	description: string; // Long description (full paragraph)
	shortDescription: string; // Short description (1-2 sentences)
	image: string; // Cloudinary public ID (without extension)
	// Format: "portfolio-project-name"
	// Full URL: baseUrl/c_fill,w_600,h_450/portfolio-project-name.jpg

	category: string; // Type of project (e.g., "Web", "Design")
	tags: string[]; // Technology tags (e.g., ["React", "Node.js"])
	year: number; // Project completion year

	featured: boolean; // Whether to show in hero grid and featured sections

	client?: string; // Optional: Client name if applicable
	// When present, project appears in contact page "Recent Client Work"

	link?: string; // Optional: External link to project
	github?: string; // Optional: GitHub repository URL
}

interface ProjectsData {
	projects: Project[];
}
```

**Example Project**:

```json
{
	"key": "dv_niketan.jpeg",
	"title": "DV Niketan - Interior Design Website",
	"description": "A modern website for an interior design studio...",
	"shortDescription": "Interior design studio showcase",
	"image": "portfolio-dv-niketan",
	"category": "Web",
	"tags": ["Next.js", "React", "Tailwind CSS", "Cloudinary"],
	"year": 2024,
	"featured": true,
	"client": "DV Niketan",
	"link": "https://dvniketan.com"
}
```

**Key Conventions**:

- `key` field is the unique identifier AND used in URL routing (e.g., `/projects/dv_niketan.jpeg`)
- `image` field is Cloudinary public ID (no extension; no domain)
- `featured: true` projects appear:
  - First in all grids/lists (alphabetically by key within featured)
  - In home page hero section
  - As featured project in contact page (right side)
- `client` field (when present) filters for contact page "Recent Client Work" section

**Sorting Rules** (implemented in API and components):

1. Featured projects first (`.featured === true`)
2. Within each group, sort alphabetically by `.key`

**Total Current Projects**: 40+

**Used By**:

- `/api/projects` route — Returns filtered/sorted list
- `app/projects/page.tsx` — All projects grid
- `app/projects/[projectKey]/page.tsx` — Detail page
- `app/contact/page.tsx` — Client projects filtering
- `components/sections/work-grid.tsx` — Home page preview

---

## contact.json

**Purpose**: Contact page configuration (channels, heading, social media)

**Location**: `/public/data/contact.json`

**Type Definitions**: `ContactData` and `ContactChannel` in `types/portfolio.ts`

**Schema**:

```typescript
interface ContactChannel {
	label: string; // Display name (e.g., "Email", "Instagram")
	href: string; // Link URL (e.g., "mailto:...", "https://instagram.com/...")
	icon: string; // react-icons component name (e.g., "MdMail", "FaInstagram")
}

interface ContactData {
	heading: string; // Page heading
	summary: string; // Page description/intro text

	channels: ContactChannel[]; // Array of 6 social/contact channels

	vcard: {
		filename: string; // VCard export filename (e.g., "bharat-bhusal.vcf")
	};
}
```

**Example**:

```json
{
	"heading": "Let's connect",
	"summary": "Feel free to reach out...",
	"channels": [
		{
			"label": "Email",
			"href": "mailto:contact@bharatbhusal.com",
			"icon": "MdMail"
		},
		{
			"label": "Phone",
			"href": "tel:+1234567890",
			"icon": "MdPhone"
		},
		{
			"label": "Instagram",
			"href": "https://instagram.com/bharatbhusal",
			"icon": "FaInstagram"
		},
		{
			"label": "LinkedIn",
			"href": "https://linkedin.com/in/bharatbhusal",
			"icon": "FaLinkedin"
		},
		{
			"label": "Facebook",
			"href": "https://facebook.com/bharatbhusal",
			"icon": "FaFacebook"
		},
		{
			"label": "Pinterest",
			"href": "https://pinterest.com/bharatbhusal",
			"icon": "FaPinterest"
		}
	],
	"vcard": {
		"filename": "bharat-bhusal.vcf"
	}
}
```

**Icon Convention**:

- Icons use react-icons naming: `MdXxx` (Material Design) or `FaXxx` (FontAwesome)
- Resolved dynamically via `lib/iconMapper.ts`
- Must be registered in iconMap for rendering

**Display Layout**:

- Heading + summary at top
- Channels grid (2 columns mobile, 6 columns desktop)
- Below: "Recent Client Work" — projects filtered by `client` field
- Right side: Featured project card

**Used By**:

- `app/contact/page.tsx` — Fetch and display
- `components/sections/contact.tsx` — Render channels grid + projects
- `components/layout/footer.tsx` — Copy channels for footer links

---

## aboutMe.json

**Purpose**: About page content (bio, stats, skills)

**Location**: `/public/data/aboutMe.json`

**Type Definition**: `AboutData` in `types/portfolio.ts`

**Schema**:

```typescript
interface SectionStat {
	label: string; // Stat label (e.g., "Projects Completed")
	value: string | number; // Stat value (e.g., "40+")
}

interface AboutData {
	heading: string; // Page heading

	introduction: string; // Long bio paragraph(s)

	skills: {
		[category: string]: string[]; // Grouped skills
		// e.g., { "Frontend": ["React", "Next.js"], ... }
	};

	stats: SectionStat[]; // Array of 3-6 statistics
}
```

**Example**:

```json
{
	"heading": "About Me",
	"introduction": "I'm a full-stack developer focusing on...",
	"skills": {
		"Frontend": [
			"React",
			"Next.js",
			"TypeScript",
			"Tailwind CSS"
		],
		"Backend": ["Node.js", "Express", "PostgreSQL"],
		"Tools": ["Git", "Docker", "AWS"]
	},
	"stats": [
		{
			"label": "Projects Completed",
			"value": "40+"
		},
		{
			"label": "Years of Experience",
			"value": "5"
		},
		{
			"label": "Technologies",
			"value": "20+"
		}
	]
}
```

**Used By**:

- `app/about/page.tsx` — Full about page
- `components/sections/about.tsx` — Home page about preview

---

## Data Loading & Caching

**Mechanism**: `lib/data.ts` — `fetchJson()` function

```typescript
async function fetchJson<T>(filePath: string): Promise<T> {
	// 1. Read file from disk
	const filepath = join(process.cwd(), filePath);
	const contents = await readFile(filepath, "utf-8");

	// 2. Parse JSON
	const data = JSON.parse(contents);

	// 3. Return typed data
	return data as T;
}
```

**Caching Strategy**:

- **API Routes** (`app/api/*`):
  - Cache timing: `force-cache`
  - Revalidate: `60 * 60` (1 hour ISR)
  - Effect: First request cached; subsequent requests use cache for 1 hour
- **Server Components** (`app/**/page.tsx`):
  - Implicit caching via Next.js
  - Revalidation at build or via `revalidatePath()`

**Example from API route**:

```typescript
export const revalidate = 60 * 60; // 1 hour ISR

export async function GET(request: Request) {
	const projectsData = await fetchJson<ProjectsData>(
		"/public/data/projects.json",
	);

	return Response.json(projectsData, {
		headers: {
			"Cache-Control":
				"public, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
}
```

---

## Schema Validation

TypeScript types in `types/portfolio.ts` provide compile-time validation.

**No runtime validation is performed** — if JSON is invalid:

1. `JSON.parse()` throws error
2. Error propagates to page component
3. Page fails to render (caught by error boundary or shows 500 error)

**Best Practice**: Validate JSON files manually before committing to ensure:

- All required fields present
- Icon names exist in `lib/iconMapper.ts`
- Project keys are unique and URL-safe
- Cloudinary image IDs are valid

---

## Content Update Workflow

### To add a new project:

1. Edit `/public/data/projects.json`
2. Add new `Project` object to `projects[]` array
3. Wait 1 hour for ISR revalidation, OR
4. Run `npm run revalidate` (if implemented) to purge cache

### To update contact channels:

1. Edit `/public/data/contact.json`
2. Add/update `ContactChannel` objects in `channels[]`
3. Ensure `icon` field matches entry in `lib/iconMapper.ts`
4. ISR revalidation auto-applies

### To add a new icon:

1. Install icon from react-icons: `npm install react-icons`
2. Import in `lib/iconMapper.ts`
3. Add entry to `iconMap` Record
4. Use icon name in JSON data (contact.json or elsewhere)

---

## Related Documentation

- **Type Definitions**: See `types/portfolio.ts`
- **Icon Mapping**: See [PATTERNS.md](./PATTERNS.md#icon-mapping)
- **Cloudinary URLs**: See [PATTERNS.md](./PATTERNS.md#cloudinary-integration)
- **API Endpoints**: See [API-ROUTES.md](./API-ROUTES.md)
