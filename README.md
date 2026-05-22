# Documentation Index

Complete knowledge base for the portfolio-neeta project.

## Quick Navigation

### 🚀 Getting Started

- **[00-OVERVIEW.md](./docs/00-OVERVIEW.md)** ← Start here
  - Project structure
  - Quick start commands
  - Key principles
  - Important Next.js 16 quirks

### 🏗️ Architecture & Design

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)**
  - System architecture diagrams
  - Data flow (browser → server → CDN)
  - Component hierarchy
  - Client/Server boundaries
  - Request-response cycle

### 📊 Data & Schema

- **[DATA-STRUCTURE.md](./docs/DATA-STRUCTURE.md)**
  - JSON file schemas (site, projects, contact, aboutMe)
  - Type definitions
  - Data loading & caching strategy
  - Content update workflow

### 🔌 API Routes

- **[API-ROUTES.md](./docs/API-ROUTES.md)**
  - `/api/projects` endpoint (filtering, sorting)
  - `/api/images` endpoint
  - Query parameters
  - Response formats
  - Caching & revalidation

### 🎨 Components & UI

- **[COMPONENTS-AND-UI.md](./docs/COMPONENTS-AND-UI.md)**
  - Page components
  - Section components
  - Card components
  - UI component library
  - Animation components
  - Layout patterns
  - Best practices

### 📦 Technology Stack

- **[TECH-STACK.md](./docs/TECH-STACK.md)**
  - All dependencies and versions
  - Why each tool was chosen
  - Bundle size estimates
  - Performance optimizations
  - Migration notes

### 💻 Development

- **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)**
  - Installation & setup
  - Running dev server
  - Building for production
  - Code quality (linting, type checking)
  - File editing guidelines
  - Server/Client component rules
  - Icon management
  - Debugging
  - Common tasks
  - Troubleshooting

### 🚀 Deployment

- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)**
  - Vercel deployment (recommended)
  - Netlify deployment
  - Self-hosted VPS setup
  - Docker deployment
  - Environment variables
  - ISR & revalidation
  - Monitoring & logs
  - Rollback & hotfixes
  - Maintenance checklist

### 🎯 Patterns & Conventions

- **[PATTERNS.md](./docs/PATTERNS.md)**
  - Data fetching pattern
  - Sorting pattern (featured + alphabetic)
  - Icon mapping centralization
  - Filtering & querying
  - Event handler boundaries
  - Image integration (Cloudinary)
  - SEO metadata generation
  - Animation lifecycle
  - TypeScript conventions
  - CVA component variants
  - Responsive design
  - Common gotchas

---

## Common Workflows

### "I Need to..."

#### ...add a new page

→ See [DEVELOPMENT.md](./docs/DEVELOPMENT.md#adding-a-new-page) + [COMPONENTS-AND-UI.md](./docs/COMPONENTS-AND-UI.md#page-components)

#### ...add a project to the portfolio

→ See [DEVELOPMENT.md](./docs/DEVELOPMENT.md#add-project-to-portfolio) + [DATA-STRUCTURE.md](./docs/DATA-STRUCTURE.md#projectsjson)

#### ...add a new icon

→ See [DEVELOPMENT.md](./docs/DEVELOPMENT.md#adding-a-new-icon) + [PATTERNS.md](./docs/PATTERNS.md#icon-mapping-pattern)

#### ...update contact channels

→ See [DEVELOPMENT.md](./docs/DEVELOPMENT.md#update-contact-channels) + [DATA-STRUCTURE.md](./docs/DATA-STRUCTURE.md#contactjson)

#### ...create a new component

→ See [COMPONENTS-AND-UI.md](./docs/COMPONENTS-AND-UI.md#adding-a-new-component) + [PATTERNS.md](./docs/PATTERNS.md)

#### ...modify styling

→ See [COMPONENTS-AND-UI.md](./docs/COMPONENTS-AND-UI.md#styling-system) + [TECH-STACK.md](./docs/TECH-STACK.md#styling)

#### ...deploy to production

→ See [DEPLOYMENT.md](./docs/DEPLOYMENT.md#vercel-recommended)

#### ...debug an issue

→ See [DEVELOPMENT.md](./docs/DEVELOPMENT.md#debugging) + [PATTERNS.md](./docs/PATTERNS.md#common-gotchas)

#### ...understand the project structure

→ See [00-OVERVIEW.md](./docs/00-OVERVIEW.md) + [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

#### ...understand data flow

→ See [ARCHITECTURE.md](./docs/ARCHITECTURE.md#data-flow) + [DATA-STRUCTURE.md](./docs/DATA-STRUCTURE.md)

#### ...set up locally for the first time

→ See [DEVELOPMENT.md](./docs/DEVELOPMENT.md#installation)

#### ...check how APIs work

→ See [API-ROUTES.md](./docs/API-ROUTES.md) + [PATTERNS.md](./docs/PATTERNS.md#filteringquerying-pattern)

---

## File Reference

### Code Structure

```
portfolio-neeta/
├── app/                    → Next.js app router pages
├── components/             → Reusable React components
├── hooks/                  → Custom React hooks
├── lib/                    → Utilities & helpers
├── public/data/            → JSON data files ← UPDATE THESE
├── types/                  → TypeScript definitions
├── styles/                 → Global CSS
├── next.config.ts          → Next.js config
├── package.json            → Dependencies
├── tsconfig.json           → TypeScript config
└── docs/                   → This documentation (YOU ARE HERE)
```

### Key Files to Edit

| File                        | Purpose             | When to Edit              |
| --------------------------- | ------------------- | ------------------------- |
| `public/data/projects.json` | Portfolio items     | Adding projects           |
| `public/data/contact.json`  | Contact page config | Updating contact info     |
| `public/data/aboutMe.json`  | About page content  | Updating bio              |
| `public/data/site.json`     | Global metadata     | Changing site name        |
| `lib/iconMapper.ts`         | Icon registry       | Adding new icons          |
| `types/portfolio.ts`        | Type definitions    | Extending data structures |

### Key Files (Don't Edit Without Reason)

| File             | Reason                          |
| ---------------- | ------------------------------- |
| `next.config.ts` | Contains build & image config   |
| `app/layout.tsx` | Root layout; affects entire app |
| `.eslintrc.* `   | Linting rules                   |
| `package.json`   | Dependencies; use `npm install` |

---

## For AI Agents

### If You're Implementing a Feature

1. **Understand the current architecture**: Read [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
2. **Check data structure**: Find relevant schema in [DATA-STRUCTURE.md](./docs/DATA-STRUCTURE.md)
3. **Review patterns**: Look for similar implementations in [PATTERNS.md](./docs/PATTERNS.md)
4. **Verify tech stack**: Check dependencies in [TECH-STACK.md](./docs/TECH-STACK.md)
5. **Test locally**: Follow [DEVELOPMENT.md](./docs/DEVELOPMENT.md#development-server)
6. **Deploy**: Use [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for production steps

### If You're Debugging

1. **Check browser console**: [DEVELOPMENT.md](./docs/DEVELOPMENT.md#browser-devtools) - DevTools section
2. **Review component props**: [COMPONENTS-AND-UI.md](./docs/COMPONENTS-AND-UI.md)
3. **Verify data flow**: [ARCHITECTURE.md](./docs/ARCHITECTURE.md#data-flow)
4. **Check for gotchas**: [PATTERNS.md](./docs/PATTERNS.md#common-gotchas)
5. **Look at error logs**: [DEPLOYMENT.md](./docs/DEPLOYMENT.md#view-logs)

### If You're Integrating Something New

1. **Review current tech stack**: [TECH-STACK.md](./docs/TECH-STACK.md)
2. **Check for conflicts**: Search existing code for similar functionality
3. **Update dependencies**: Add to `package.json`, run `npm install`
4. **Add type definitions**: Create in `types/portfolio.ts` if needed
5. **Follow patterns**: Implement using existing code patterns
6. **Test thoroughly**: Build, lint, and test locally

### Knowledge Prerequisites

Before contributing, understand:

- ✅ Next.js 16 App Router (server/client components)
- ✅ React 19 hooks & components
- ✅ TypeScript basics (interfaces, generics)
- ✅ Tailwind CSS utility classes
- ✅ GSAP animation library (if touching animations)
- ✅ JSON data structure conventions

---

## Version Information

**As of**: May 2026

**Project**: portfolio-neeta

**Framework**: Next.js 16.2.4

**React**: 19.2.4

**TypeScript**: 5.x

**Status**: Production-ready

---

## Updating This Documentation

When adding new files, features, or making architectural changes:

1. Update relevant existing `.md` files
2. Add new `.md` if introducing major feature
3. Update this index (`README.md`)
4. Run `npm run build` to ensure no TypeScript errors
5. Commit documentation in same PR as code changes

---

## Quick Links

- **GitHub**: https://github.com/bharatbhusal/portfolio-neeta
- **Vercel Deployment**: https://portfolio-neeta.vercel.app
- **Live Site**: https://bharatbhusal.com
- **Cloudinary**: https://cloudinary.com

---

## Documentation Contributions

Found an error or missing info?

- Open an issue on GitHub
- Submit a pull request with corrections
- Keep documents concise and code-focused
- Include code examples where helpful

---

**Happy contributing! 🚀**

For questions about this documentation, check [00-OVERVIEW.md](./docs/00-OVERVIEW.md) first.
