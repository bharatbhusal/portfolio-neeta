# Portfolio Neeta - Project Overview

> **For AI Agents**: This documentation provides a complete architectural overview to enable productive contributions to the codebase.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (requires webpack)
npm run dev

# Build for production (requires webpack)
npm run build

# Run linter
npm run lint
```

## Project Structure

```
portfolio-neeta/
├── docs/                    # Documentation (this folder)
├── app/                     # Next.js App Router
│   ├── api/                # API routes (/api/images, /api/projects)
│   ├── about/              # /about page
│   ├── contact/            # /contact page
│   ├── projects/           # /projects listing and /projects/[projectKey] detail
│   ├── layout.tsx          # Root layout with navbar/footer
│   ├── page.tsx            # Home page
│   ├── robots.ts           # SEO robots meta
│   └── sitemap.ts          # SEO sitemap meta
├── components/             # Reusable React components
│   ├── animations/         # GSAP-based animation wrappers (Reveal)
│   ├── cards/              # Card components (ProjectCard)
│   ├── layout/             # Navigation layout (Navbar, Footer)
│   ├── projects/           # Project-specific components
│   ├── sections/           # Page sections (Hero, About, Contact, WorkGrid)
│   └── ui/                 # Basic UI (Button, Card, Separator)
├── hooks/                  # Custom React hooks (useGSAP)
├── lib/                    # Utilities and helpers
│   ├── data.ts            # JSON fetching with caching
│   ├── seo.ts             # SEO metadata generation
│   ├── utils.ts           # General utilities
│   └── iconMapper.ts      # Centralized icon name mapping
├── public/data/           # JSON data files (source of truth)
│   ├── site.json          # Global site metadata
│   ├── projects.json      # Portfolio items
│   ├── contact.json       # Contact page config
│   └── aboutMe.json       # About page content
├── types/                 # TypeScript definitions
│   └── portfolio.ts       # All data type definitions
├── styles/                # CSS files
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies and build scripts
└── tsconfig.json          # TypeScript configuration

```

## Key Principles

### 1. **Data-Driven Architecture**

- All content lives in `/public/data/*.json` files
- Components receive data as props; no direct data imports
- API routes handle data validation and transformation
- See [DATA-STRUCTURE.md](./DATA-STRUCTURE.md) for schemas

### 2. **Type Safety**

- All data types defined in `types/portfolio.ts`
- Components use TypeScript interfaces for props
- API routes validate response types
- No `any` types; strict mode enabled

### 3. **Server/Client Component Boundaries**

- **Server Components** (default): Page components, data fetching
- **Client Components** (`"use client"`): Event handlers, animations, interactive elements
- See [DEVELOPMENT.md](./DEVELOPMENT.md#clientserver-component-rules) for rules

### 4. **Animation & Interactivity**

- GSAP ScrollTrigger for scroll-based animations
- Custom `useGSAP()` hook manages lifecycle
- Reveal component wraps animated content
- Positioned in `components/animations/reveal.tsx`

### 5. **Styling**

- Tailwind CSS 4 with PostCSS
- shadcn/ui components (Radix Nova) for base UI
- class-variance-authority (CVA) for component variants
- Custom CSS in `styles/globals.css`

### 6. **Icon System**

- **Library**: react-icons (Material Design + FontAwesome)
- **Mapping**: Centralized in `lib/iconMapper.ts`
- **Convention**: Icon names stored in JSON (e.g., `"MdMail"`, `"FaInstagram"`)
- **Usage**: Components resolve icon names dynamically at runtime
- See [PATTERNS.md](./PATTERNS.md#icon-mapping) for details

### 7. **Image Handling**

- Cloudinary CDN for all portfolio images
- Unoptimized Next.js Image (via `unoptimized: true` in config)
- Remote pattern configured for Cloudinary domain
- See [PATTERNS.md](./PATTERNS.md#cloudinary-integration) for URL format

## Important Next.js 16 Quirks

1. **Build requires webpack flag**: `npm run build` is pre-configured with `--webpack` for PWA support
2. **Root layout is force-dynamic**: Disables static generation; necessary for real-time content
3. **API routes use force-cache**: ISR revalidation every 1 hour
4. **React Compiler enabled**: Babel plugin for automatic memo optimization
5. **No dynamic imports for icons**: Icon components imported statically then resolved dynamically

## File Dependencies

```
app/page.tsx
├── components/sections/hero.tsx        (MdArrowOutward icon)
├── components/sections/about.tsx
├── components/sections/work-grid.tsx   (ProjectCard, projects API)
└── components/layout/navbar.tsx        (navigation)

app/contact/page.tsx
├── lib/data.ts                          (fetchJson)
├── public/data/contact.json
├── public/data/projects.json
└── components/sections/contact.tsx     (channels grid, projects list, ProjectCard)

app/projects/page.tsx
├── lib/data.ts                          (fetchJson)
├── public/data/projects.json
└── components/cards/project-card.tsx

app/about/page.tsx
├── public/data/aboutMe.json
└── lib/seo.ts                           (metadata)

api/projects
├── public/data/projects.json
└── types/portfolio.ts

api/images
├── public/data/projects.json
└── Cloudinary integration
```

## Navigation Map

| Route                    | Component                            | Data                                   | Purpose                                       |
| ------------------------ | ------------------------------------ | -------------------------------------- | --------------------------------------------- |
| `/`                      | `app/page.tsx`                       | site.json, projects.json, aboutMe.json | Home page with hero, about preview, work grid |
| `/about`                 | `app/about/page.tsx`                 | aboutMe.json                           | Full about page                               |
| `/projects`              | `app/projects/page.tsx`              | projects.json                          | All projects grid                             |
| `/projects/[projectKey]` | `app/projects/[projectKey]/page.tsx` | projects.json                          | Individual project detail                     |
| `/contact`               | `app/contact/page.tsx`               | contact.json, projects.json            | Contact with channels and client projects     |
| `/api/projects`          | `app/api/projects/route.ts`          | projects.json                          | JSON endpoint for projects (with filtering)   |
| `/api/images`            | `app/api/images/route.ts`            | projects.json                          | JSON endpoint for image metadata              |

## Next Steps

- **Setup**: See [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Data Model**: See [DATA-STRUCTURE.md](./DATA-STRUCTURE.md)
- **API Endpoints**: See [API-ROUTES.md](./API-ROUTES.md)
- **UI Components**: See [COMPONENTS-AND-UI.md](./COMPONENTS-AND-UI.md)
- **Tech Stack**: See [TECH-STACK.md](./TECH-STACK.md)
- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Patterns & Conventions**: See [PATTERNS.md](./PATTERNS.md)
