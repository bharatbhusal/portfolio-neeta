# Components and UI System

## Component Architecture

### Page Components

Located in `app/*/page.tsx`. **Server Components by default** unless explicitly marked `'use client'`.

#### `app/page.tsx` — Home Page

**File**: `app/page.tsx`

**Type**: Server Component

**Data Flow**:

```typescript
const [site, contact, projects, about] = await Promise.all([
	fetchJson<SiteData>("/public/data/site.json"),
	fetchJson<ContactData>("/public/data/contact.json"),
	fetchJson<ProjectsData>("/public/data/projects.json"),
	fetchJson<AboutData>("/public/data/aboutMe.json"),
]);
```

**Rendered Sections**:

1. `<Navbar />` (from layout)
2. `<Hero contact={contact} />`
3. `<About aboutMe={about} />`
4. `<WorkGrid projects={projects.projects} />`
5. `<Footer />` (from layout)

**Metadata** (SEO): Generated via `generateMetadata()` using `lib/seo.ts`

#### `app/about/page.tsx` — About Page

**Type**: Server Component

**Data**: Fetches `aboutMe.json`

**Component**: Renders `<About />` section

#### `app/projects/page.tsx` — Projects Listing

**Type**: Server Component

**Data**: Fetches `projects.json`, filters to featured

**Components**: Multiple `<ProjectCard />` in grid layout

#### `app/projects/[projectKey]/page.tsx` — Project Detail

**Type**: Server Component

**Params**: `projectKey` from URL (e.g., `/projects/dv_niketan.jpeg`)

**Data**: Fetches `projects.json`, finds project by `key`

**Components**: `<ProjectPageContent />` showing full details

#### `app/contact/page.tsx` — Contact Page

**Type**: Server Component

**Data**: Fetches both `contact.json` and `projects.json`

**Components**: Renders `<Contact />` section with channels and client projects

---

### Layout Components

#### `app/layout.tsx` — Root Layout

**Type**: Server Component (set to `dynamic: 'force-dynamic'`)

**Purpose**:

- Wraps entire app
- Renders `<Navbar />` at top
- Renders `<Footer />` at bottom
- Children rendered in middle

**Client Directive**: No (children may be client components)

**Key Configuration**:

```typescript
export const dynamic = "force-dynamic"; // Always fresh content
```

**Styling**: Global CSS, font setup

---

### Section Components

Located in `components/sections/`. **Mix of Server and Client Components**.

#### `components/sections/hero.tsx` — Landing Hero

**Type**: Client Component (`'use client'`)

**Why Client**: Scroll animations via GSAP

**Props**:

```typescript
interface HeroProps {
	contact: ContactData;
}
```

**Features**:

- Large title + tagline
- Description text
- CTA buttons (with `MdArrowOutward` icon from react-icons)
- Animated entrance via `<Reveal >` wrapper
- Parallax scrolling effect

**Animation**:

```typescript
const timeline = gsap.timeline({ scrollTrigger: {...} });
timeline.from('.hero-title', { opacity: 0, y: 50 });
timeline.from('.hero-desc', { opacity: 0, y: 30 }, '<');
```

#### `components/sections/about.tsx` — About Preview

**Type**: Server Component

**Props**:

```typescript
interface AboutProps {
	aboutMe: AboutData;
}
```

**Features**:

- Introduction text
- Skills grid (by category)
- Statistics display
- Section heading with separator

#### `components/sections/work-grid.tsx` — Projects Grid

**Type**: Server Component

**Props**:

```typescript
interface WorkGridProps {
	projects: Project[];
}
```

**Features**:

- Responsive grid (1 column mobile, 2 columns tablet, 3 columns desktop)
- Uses `<ProjectCard />` for each project
- Auto-sorts: featured first, then alphabetical
- Click to navigate to detail page

#### `components/sections/contact.tsx` — Contact Section

**Type**: Client Component (`'use client'`)

**Why Client**: Interactive channel buttons, animations via `useGSAP`

**Props**:

```typescript
interface ContactProps {
	contact: ContactData;
	projects: Project[];
}
```

**Layout**: Three-column layout

1. **Left**: Heading, summary, channels grid
2. **Middle**: "Recent Client Work" list (filtered projects with `.client` field)
3. **Right**: Featured project card

**Features**:

- Channels grid with icons (2 columns mobile, 6 columns desktop)
- Icon resolution via `lib/iconMapper.ts`
- Project filtering: Only projects where `.client` exists
- Sorting:
  ```typescript
  const clientProjects = projects
  	.filter((p) => p.client)
  	.sort((a, b) => {
  		if (a.featured !== b.featured)
  			return b.featured ? 1 : -1;
  		return a.key.localeCompare(b.key);
  	});
  ```
- Scroll animations on each element

**Rendering**:

```tsx
// Channels grid
<div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
  {contact.channels.map(channel => (
    <ChannelButton key={channel.label} channel={channel} />
  ))}
</div>

// Client projects list
<div className="flex flex-col gap-3">
  {clientProjects.map(p => (
    <ProjectLink key={p.key} project={p} />
  ))}
</div>

// Featured project
<ProjectCard project={clientProjects[0]} />
```

---

### Card Components

Located in `components/cards/`.

#### `components/cards/project-card.tsx` — Project Display Card

**Type**: Client Component (for click navigation)

**Props**:

```typescript
interface ProjectCardProps {
	project: Project;
	variant?: "default" | "compact"; // CVA-based styling
}
```

**Features**:

- Project image with:
  - Right-side fade gradient overlay (`bg-gradient-to-r from-transparent to-background/40`)
  - Year badge positioned **on top of image** (top-right corner)
- Title and short description below
- Click anywhere to navigate to `/projects/[projectKey]`
- Hover effects: scale, shadow increase

**Image Styling**:

```tsx
<div className="relative overflow-hidden rounded-lg aspect-[4/3]">
	<Image
		src={imageUrl}
		alt={project.title}
		fill
		className="object-cover"
	/>

	{/* Gradient overlay: left transparent → right dark */}
	<div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/40" />

	{/* Year badge */}
	<div className="absolute top-3 right-3 bg-background/90 px-2 py-1 rounded text-sm font-semibold">
		{project.year}
	</div>
</div>
```

**CVA Variants** (if implemented):

```typescript
const cardVariants = cva("...", {
	variants: {
		variant: {
			default: "aspect-[4/3] p-4",
			compact: "aspect-[16/9] p-2",
		},
	},
});
```

---

### UI Components

Located in `components/ui/`. **Atomic UI components** (Button, Card, Separator).

#### `components/ui/button.tsx` — Button Component

**Type**: Client Component (has onClick)

**Props** (CVA-based):

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "outline" | "secondary" | "ghost";
	size?: "icon" | "sm" | "md" | "lg";
	disabled?: boolean;
}
```

**Variants**:

- `default`: Filled, primary color
- `outline`: Border only, transparent fill
- `secondary`: Secondary color fill
- `ghost`: No fill, text only

**Sizes**:

- `sm`: Small (padding reduced)
- `md`: Medium (default)
- `lg`: Large (padding increased)
- `icon`: Square, for icon-only buttons

**Example**:

```tsx
<Button variant="default" size="md" onClick={handleClick}>
	Get Started
</Button>
```

#### `components/ui/card.tsx` — Card Component

**Type**: Server Component

**Props**:

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
}
```

**Styling**: Rounded border, shadow, padding

**Example**:

```tsx
<Card className="p-6">
	<h2>Card Title</h2>
	<p>Card content</p>
</Card>
```

#### `components/ui/separator.tsx` — Separator Component

**Type**: Server Component

**Props**:

```typescript
interface SeparatorProps {
	orientation?: "horizontal" | "vertical";
	variant?: "default" | "subtle";
}
```

**Usage**: Divider between sections

```tsx
<Separator orientation="horizontal" variant="default" />
```

---

### Animation Components

Located in `components/animations/`.

#### `components/animations/reveal.tsx` — Scroll-Based Animation Wrapper

**Type**: Client Component (`'use client'`)

**Purpose**: Animates children when they scroll into view (via GSAP ScrollTrigger)

**Props**:

```typescript
interface RevealProps {
	children: React.ReactNode;
	direction?: "up" | "down" | "left" | "right";
	delay?: number;
	duration?: number;
}
```

**How It Works**:

```typescript
useGSAP(() => {
	gsap.from(".reveal-element", {
		opacity: 0,
		y: direction === "up" ? 50 : 0,
		duration: duration,
		delay: delay,
		scrollTrigger: {
			trigger: ".reveal-element",
			start: "top 80%",
			end: "bottom 20%",
			toggleActions: "play none none none",
		},
	});
});
```

**Example**:

```tsx
<Reveal direction="up" delay={0.2}>
	<h2>This animates when in view</h2>
</Reveal>
```

---

### Layout Components

#### `components/layout/navbar.tsx` — Navigation Bar

**Type**: Server Component

**Features**:

- Logo/site name
- Navigation links (Home, About, Projects, Contact)
- Active link highlighting
- Mobile menu (may use client component for toggle)
- Sticky or fixed positioned

#### `components/layout/footer.tsx` — Footer

**Type**: Client Component (`'use client'`)

**Why Client**: Has event handlers (onClick for channel links)

**Features**:

- Brand/copyright section
- Navigation links
- Connect section with contact channels
- Uses `lib/iconMapper.ts` to render channel icons

**Channel Link Behavior**:

```typescript
const handleChannelClick = (channel: ContactChannel) => {
	window.open(channel.href, "_blank", "noopener,noreferrer");
};
```

---

## Layout Patterns

### Home Page Layout

```
┌─────────────────────────────────────────┐
│           Navbar                        │
├─────────────────────────────────────────┤
│                                         │
│           Hero Section                  │ (scroll animation)
│    (title, description, CTA)            │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│          About Preview                  │
│    (intro, skills, stats)               │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         Work Grid (Featured)            │
│    [Card] [Card] [Card]                 │
│    [Card] [Card] [Card]                 │
│                                         │
├─────────────────────────────────────────┤
│              Footer                     │
└─────────────────────────────────────────┘
```

### Contact Page Layout

```
┌──────────────────────────────────────────┐
│    Heading + Summary                     │
├──────────────┬──────────────────────────┤
│   Channels   │  Recent Client Work      │
│   (grid of   │  [Project]               │ [Featured
│    6 icons)  │  [Project]               │  Project]
│              │  [Project]               │  [Card]
└──────────────┴──────────────────────────┘
```

---

## Styling System

### Tailwind Integration

```typescript
// tailwind.config.js
export default {
	theme: {
		extend: {
			colors: {
				background: "hsl(0 0% 100%)", // Dynamic from CSS variables
				foreground: "hsl(0 0% 0%)",
				card: "hsl(0 0% 96%)",
				primary: "hsl(210 100% 50%)", // Changeable
			},
			spacing: {
				gutter: "20px", // Custom gutter size
				section: "60px", // Section padding
			},
			typography: {
				DEFAULT: { css: { maxWidth: "100%" } },
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
```

### CVA Pattern (class-variance-authority)

For component variants, use CVA instead of inline class logic:

```typescript
// ❌ Bad: Inline conditionals
className={isActive ? 'bg-blue-500 text-white' : 'bg-gray-100'}

// ✅ Good: CVA variants
import { cva } from 'class-variance-authority';

const buttonVariants = cva('px-4 py-2 rounded font-medium', {
  variants: {
    variant: {
      default: 'bg-blue-500 text-white hover:bg-blue-600',
      outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
    },
    size: {
      sm: 'text-sm px-2 py-1',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

function Button({ variant, size, ...props }) {
  return <button className={buttonVariants({ variant, size })} {...props} />;
}
```

---

## Best Practices

### 1. Always Define Component Props Types

```typescript
// ✅ Good
interface ProjectCardProps {
	project: Project;
	variant?: "default" | "compact";
}

function ProjectCard({
	project,
	variant = "default",
}: ProjectCardProps) {
	// ...
}

// ❌ Bad
function ProjectCard(props: any) {}
function ProjectCard({
	project,
	variant,
}: {
	project: any;
	variant: any;
}) {}
```

### 2. Separate Server and Client Components

```typescript
// ✅ Good: Server component for data fetching
// app/projects/page.tsx
const ProjectsPage = async () => {
  const projects = await fetchJson(...);
  return <ProjectsGrid projects={projects} />;  // Pass as props
};

// ✅ Good: Client component for interactivity
// components/projects-grid.tsx
'use client';
function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [filtered, setFiltered] = useState(projects);
  // ...
}

// ❌ Bad: Fetching in client component
'use client';
function ProjectsGrid() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetch('/api/projects');  // Client-side fetch
  }, []);
}
```

### 3. Use Composition Over Props Drilling

```typescript
// ❌ Bad: Props drilling
<Layout project={project}>
  <Section project={project}>
    <Card project={project}>
      <Image src={project.image} />
    </Card>
  </Section>
</Layout>

// ✅ Good: Composition
<Layout>
  <Section>
    <Card>
      <ProjectImage project={project} />
    </Card>
  </Section>
</Layout>
```

### 4. Leverage Built-In Components

Use shadcn/ui and Radix UI components instead of custom HTML:

```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function MyComponent() {
  return (
    <Card className="p-6">
      <h2>Title</h2>
      <Button>Click Me</Button>
    </Card>
  );
}
```

### 5. Icon Naming Convention

All icon names in JSON should follow react-icons naming:

- Material Design: `MdXxx` (e.g., `MdMail`, `MdPhone`)
- FontAwesome: `FaXxx` (e.g., `FaInstagram`, `FaLinkedin`)

For other icon sets, register in `lib/iconMapper.ts` before use.
