# Patterns & Conventions

Recurring patterns, best practices, and gotchas throughout the codebase.

---

## Data Fetching Pattern

**Server Components** use centralized fetch function:

```typescript
// ✅ Good: Use lib/data.ts
import { fetchJson } from '@/lib/data';
import { ProjectsData } from '@/types/portfolio';

async function ProjectsPage() {
  const projectsData = await fetchJson<ProjectsData>('/public/data/projects.json');
  return <ProjectGrid projects={projectsData.projects} />;
}
```

**Why**:

- Single caching strategy (ISR 1 hour)
- Consistent error handling
- Typed response
- No HTTP overhead (direct file read)

---

## Sorting Pattern

**All sorted lists use this two-stage pattern**:

```typescript
// Stage 1: Featured first
// Stage 2: Within each group, alphabetical by key
projects.sort((a, b) => {
	if (a.featured !== b.featured) {
		return b.featured ? 1 : -1; // featured=true comes first
	}
	return a.key.localeCompare(b.key); // Then sort by key alphabetically
});
```

**Result**:

```
featured=true, key starts with 'a'
featured=true, key starts with 'b'
featured=false, key starts with 'a'
featured=false, key starts with 'b'
```

**Used in**:

- `app/api/projects/route.ts`
- `components/sections/contact.tsx` (client projects)
- `components/sections/work-grid.tsx` (home page grid)

---

## Icon Mapping Pattern

**Centralized icon registry prevents re-importing icons everywhere**:

```typescript
// ✅ lib/iconMapper.ts
import { MdMail, MdPhone, MdArrowOutward } from 'react-icons/md';
import { FaInstagram, FaLinkedin, FaFacebook, FaPinterest } from 'react-icons/fa';

export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MdMail,
  MdPhone,
  MdArrowOutward,
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaPinterest,
};

// Usage in any component:
function ChannelButton({ channel }: { channel: ContactChannel }) {
  const Icon = iconMap[channel.icon];
  return <Icon className="w-6 h-6" />;
}
```

**Benefits**:

- Icon names live in JSON data (not code)
- Single point to add/remove icons
- Type-safe: TypeScript ensures iconMap has all necessary icons
- Easy icon library migration (update one file)

---

## Filtering & Querying Pattern

**Always filter first, then sort**:

```typescript
export async function GET(request: Request) {
  const projectsData = await fetchJson<ProjectsData>(...);

  // 1. Parse filters from query
  const featured = url.searchParams.get('featured') === 'true';
  const client = url.searchParams.get('client') === 'true';
  const year = parseInt(url.searchParams.get('year') || '0');

  // 2. Filter
  let results = projectsData.projects;
  if (featured) results = results.filter(p => p.featured);
  if (client) results = results.filter(p => p.client);
  if (year > 0) results = results.filter(p => p.year === year);

  // 3. Sort (two-stage pattern above)
  results.sort((a, b) => { ... });

  // 4. Return
  return Response.json({ projects: results });
}
```

**Applies to**:

- API endpoints
- Client-side filtering (useEffect + filter)
- Component-level filtering (direct array filter)

---

## Client Component Event Handler Pattern

**Never pass event handlers through props**:

```typescript
// ❌ Bad: Event handler passed from Server → Client Component
export async function Footer() {
  const handleClick = () => { /* ... */ };
  return <FooterClient onClick={handleClick} />;  // ERROR!
}

// ✅ Good: Event handler defined in Client Component
'use client';
export function Footer() {
  const handleClick = () => { /* ... */ };
  return <button onClick={handleClick}>Click</button>;
}
```

**Why**:

- Event handlers aren't serializable (can't pass through Server boundary)
- Client Components are the place for interactivity
- Prevents "Event handlers cannot be passed to Client Component props" error

**Applied in**:

- `components/layout/footer.tsx` — channel link handlers
- `components/sections/contact.tsx` — animation event listeners

---

## Image Integration Pattern

**Cloudinary URL construction** (for non-optimized Next.js Image):

```typescript
// ✅ Good: Build URL from parts
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const publicId = project.image;  // From JSON: 'portfolio-dv-niketan'
const url = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,w_600,h_450/${publicId}.jpg`;

export function ProjectImage({ project }: ProjectImageProps) {
  return (
    <Image
      src={url}
      alt={project.title}
      width={600}
      height={450}
      quality={80}
    />
  );
}
```

**Common Transformations**:

```
c_fill,w_600,h_450       → Crop to 600×450px (fill)
c_thumb,w_300,h_300      → Thumbnail (smart crop)
q_80                     → Quality 80%
f_auto                   → Auto format (webp if supported)
e_blur:1000              → Blur effect
o_60                     → Opacity 60%
```

**Full URL Format**:

```
https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{TRANSFORMATIONS}/{PUBLIC_ID}.{EXTENSION}
```

---

## SEO Metadata Pattern

**Centralized SEO generation via `lib/seo.ts`**:

```typescript
// ✅ lib/seo.ts
export async function generatePageMetadata(
	title: string,
	description: string,
	ogImage?: string,
): Promise<Metadata> {
	const siteData = await fetchJson<SiteData>(
		"/public/data/site.json",
	);

	return {
		title: `${title} | ${siteData.name}`,
		description,
		openGraph: {
			title,
			description,
			images: [ogImage || siteData.ogImage],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImage || siteData.ogImage],
		},
	};
}

// Usage in app/about/page.tsx:
export async function generateMetadata(): Promise<Metadata> {
	return generatePageMetadata(
		"About",
		"Learn more about Bharat Bhusal...",
		"https://...og-image.jpg",
	);
}
```

**Benefits**:

- Consistent SEO across pages
- Single place to update OG image
- Type-safe metadata
- Site name auto-appended

---

## Animation Lifecycle Pattern

**Use custom `useGSAP` hook to manage timeline cleanup**:

```typescript
'use client';
import { useGSAP } from '@/hooks/useGSAP';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  useGSAP(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-title',
        start: 'top 80%',
        end: 'bottom 20%',
      }
    });

    timeline.from('.hero-title', { opacity: 0, y: 50, duration: 0.5 });

    return () => {
      timeline.kill();  // Cleanup on unmount
    };
  });

  return <h1 className="hero-title">Title</h1>;
}
```

**Why useGSAP**:

- Manages GSAP context automatically
- Cleans up on component unmount
- Prevents memory leaks
- Handles strict mode in development

---

## TypeScript Type Pattern

**All data types in `types/portfolio.ts`**, never inline:

```typescript
// ❌ Bad: Type inline
function ProjectCard({
	project,
}: {
	project: { key: string; title: string };
}) {
	// ...
}

// ✅ Good: Type imported from types/portfolio.ts
import { Project } from "@/types/portfolio";

interface ProjectCardProps {
	project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
	// ...
}
```

**Benefits**:

- Single source of truth for data shapes
- Easy refactoring (change type once, update everywhere)
- Better IDE autocomplete
- Documentation via properties

---

## Component Variant Pattern (CVA)

**Use class-variance-authority for component variants**:

```typescript
// ❌ Bad: String concatenation for variants
function Button({ variant }) {
  const classes = variant === 'primary'
    ? 'bg-blue-500 text-white hover:bg-blue-600'
    : 'bg-gray-200 text-black hover:bg-gray-300';
  return <button className={classes}>Click</button>;
}

// ✅ Good: CVA for variants
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva('px-4 py-2 rounded font-medium', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-black hover:bg-gray-300',
      outline: 'border-2 border-blue-500 text-blue-500',
    },
    size: {
      sm: 'text-sm px-2 py-1',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

type ButtonProps = VariantProps<typeof buttonVariants>;

export function Button({ variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size })}
      {...props}
    />
  );
}
```

**Benefits**:

- Type-safe variants
- No over-applying classes
- Self-documenting
- Easy to extend

---

## Environment Variable Pattern

**Public variables only** (for browser access):

```typescript
// ✅ Good: Public environment variables
// .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=my-cloud

// Usage in component:
const imageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/...`;
```

**Private variables** (server-only):

```typescript
// .env.local
API_SECRET = secret - value;

// ❌ Can't use in component (undefined):
console.log(process.env.API_SECRET); // undefined

// ✅ Use in API route only:
// app/api/secret/route.ts
const secret = process.env.API_SECRET;
```

**Rule**: Variables used in `next.config.ts` or pages must be `NEXT_PUBLIC_`.

---

## Error Handling Pattern

**Try-catch in API routes** (if implemented):

```typescript
export async function GET(request: Request) {
  try {
    const projectsData = await fetchJson<ProjectsData>(...);

    // Process...

    return Response.json({ projects: [] });
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
```

**In Components** (via React error boundary):

```typescript
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';

export function Page() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <ProjectsGrid />
    </ErrorBoundary>
  );
}
```

---

## Responsive Design Pattern

**Mobile-first breakpoints** (Tailwind default):

```typescript
// ✅ Good: Mobile first, then tablet/desktop
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {/* Mobile: 1 column, Tablet: 2, Desktop: 3, Large: 4 */}
</div>

<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  {/* Scales text size progressively */}
</div>
```

**Breakpoints**:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Applied in**:

- Contact channels grid (2 mobile, 6 desktop)
- Project cards (responsive aspect ratios)
- Typography (text size scaling)

---

## API Caching Pattern

**ISR configuration in API routes**:

```typescript
// ✅ Good: ISR revalidation
export const revalidate = 60 * 60;  // 1 hour

export async function GET(request: Request) {
  const projectsData = await fetchJson<ProjectsData>(...);

  return Response.json(projectsData, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    }
  });
}
```

**Cache Strategy**:

- `s-maxage=3600`: Cache for 1 hour in CDN
- `stale-while-revalidate=86400`: Serve stale for 1 more day while regenerating
- `public`: Cache in CDN + browser

**Result**:

- First request: generates page
- Next 1 hour: serve cache (instant)
- After 1 hour: regenerate in background, serve cache while generating

---

## Link Navigation Pattern

**Use Next.js Link for internal routes**:

```typescript
import Link from 'next/link';

// ✅ Good: Next.js Link (prefetch)
<Link href="/projects">
  View Projects
</Link>

// ⚠️ External links: Regular anchor
<a href="https://external.com" target="_blank" rel="noopener noreferrer">
  External
</a>

// ✅ Also good: Use window.open for programmatic navigation
<button onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}>
  Open
</button>
```

**Applied in**:

- Navbar navigation (internal links)
- Project cards (click to `/projects/[key]`)
- Footer contact channels (external links with `window.open`)

---

## Form Submission Pattern

(Not currently used; add as needed)

```typescript
'use client';
import { useState } from 'react';

export function ContactForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Success
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={pending}>
        {pending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
```

---

## Composition Over Props Drilling Pattern

**Avoid passing props through multiple levels**:

```typescript
// ❌ Bad: Props drilling
<ParentLayout projects={projects}>
  <Section projects={projects}>
    <Grid projects={projects}>
      <Card project={projects[0]} />
    </Grid>
  </Section>
</ParentLayout>

// ✅ Good: Composition with context or direct data passing
export function ParentLayout() {
  return (
    <Section>
      <Grid>
        <Card />
      </Grid>
    </Section>
  );
}
```

**Why**:

- Easier to refactor
- Cleaner prop interfaces
- Prevents "prop explosion"
- Components are more self-contained

---

## Code Organization

### File Naming

- **Pascal case** for components: `ProjectCard.tsx`, `Hero.tsx`
- **kebab-case** for utilities/libs: `icon-mapper.ts`, `use-gsap.ts`
- **kebab-case** for directories: `components/cards/`, `components/sections/`

### Import Organization

```typescript
// Order: External → Internal → Relative
import React from "react";
import gsap from "gsap";

import { Button } from "@/components/ui/button";
import { fetchJson } from "@/lib/data";

import { Card } from "./card";
import styles from "./styles.css";
```

### Comment Guidelines

```typescript
// ✅ Good: Explain *why*, not *what*
// ISR revalidation prevents stale data for longer than 1 hour
export const revalidate = 60 * 60;

// ❌ Bad: Restates code
// Set revalidate to 1 hour
export const revalidate = 60 * 60; // 1 hour
```

---

## Common Gotchas

### 1. Server vs Client Components

- Default is Server
- Add `'use client'` only when needed (events, hooks)
- Can't pass event handlers through boundaries

### 2. Dynamic Imports

- Use `dynamic()` for large components
- Lazy-loads when needed
- Reduces initial bundle

### 3. Image Unoptimized

- Project uses `unoptimized: true`
- Cloudinary handles optimization
- Don't use with Next.js Image optimization

### 4. Build Requires Webpack Flag

- `npm run build` uses `--webpack`
- Don't remove this flag
- Enables PWA support

### 5. ISR Revalidation

- Takes up to 1 hour to propagate
- Use `revalidatePath()` for immediate updates (needs ISR support)
- Test locally before committing

### 6. Icon Names in JSON

- Must be registered in `lib/iconMapper.ts`
- Use exact react-icons names (e.g., `MdMail`)
- Typos cause runtime errors

### 7. Cloudinary Images

- Must have remote pattern configured
- Public IDs must exist in Cloudinary
- URLs are public (no secrets in URLs)

---

## Summary

**Key Patterns**:

1. Centralize data fetching (`lib/data.ts`)
2. Use two-stage sorting (featured + key)
3. Map icons centrally (`lib/iconMapper.ts`)
4. Filter first, sort second
5. Define types in `types/portfolio.ts`
6. Use CVA for component variants
7. Compose over prop drilling
8. Server components by default, client only when needed

**Always Reference**:

- [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- [DATA-STRUCTURE.md](./DATA-STRUCTURE.md) for schemas
- [TECH-STACK.md](./TECH-STACK.md) for dependencies
