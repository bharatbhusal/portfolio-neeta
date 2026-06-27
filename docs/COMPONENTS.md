# Component Tree Reference

## Rendering Strategy

- **Server Components (default)** — No `"use client"` directive. Fetch data, render HTML.
- **Client Components** — Explicitly marked `"use client"`. Use hooks, browser APIs, state, event handlers.

## Component Tree

```mermaid
graph TD
    Root["<b>RootLayout</b> [Server]<br/>app/layout.tsx"]

    subgraph Providers["Global Providers"]
        Theme["<b>ThemeProvider</b> [Client]<br/>next-themes"]
        Query["<b>QueryProvider</b> [Client]<br/>app/providers/query-provider.tsx"]
        UIRestrict["<b>UiRestriction</b> [Client]<br/>app/providers/ui-restriction.tsx"]
        Analytics["<b>Analytics</b> [Client]<br/>@vercel/analytics"]
    end

    subgraph Navigation["Navigation"]
        Nav["<b>Navbar</b> [Client]<br/>components/layout/navbar.tsx"]
        NavLinks["Logo / Nav links<br/>(Home, Projects, Contact, Request Logo)"]
        ThemeToggle["Theme toggle<br/>(dark/light)"]
        Nav --> NavLinks
        Nav --> ThemeToggle
    end

    subgraph Pages["Page Content [Per-route]"]
        Home["<b>Home (/)</b> [Server]<br/>app/page.tsx"]
        Home --> Hero["<b>Hero</b> [Client]<br/>components/sections/hero.tsx<br/>Profile image, tagline, CTAs"]

        ProjectList["<b>Projects (/projects)</b> [Server]<br/>app/projects/(listing)/page.tsx"]
        ProjectList --> Grid["<b>ProjectGridContent</b> [Client]<br/>components/sections/projects.tsx"]
        Grid --> Search["Search bar (InputGroup)"]
        Grid --> CatFilter["Category filter dropdown"]
        Grid --> Sort["Sort selector"]
        Grid --> Cards["<b>ProjectCardBox</b>[] [Client]<br/>components/cards/project-card-box.tsx"]
        Cards --> CardImg["Image (Cloudinary)"]
        Cards --> CardTitle["Title"]
        Cards --> CardBadge["Category badge"]
        Cards --> CardTags["Tags"]
        Grid --> Pagination["Pagination controls"]
        Grid --> EmptyState["EmptyState / NotFound"]

        Detail["<b>Project Detail (/projects/[id])</b> [Server]<br/>app/projects/[id]/page.tsx"]
        Detail --> ProjDetail["<b>ProjectDetail</b> [Client]<br/>components/sections/project.tsx<br/>Hero image, story, tags, WhatsApp"]

        ContactPage["<b>Contact (/contact)</b> [Server]<br/>app/contact/page.tsx"]
        ContactPage --> ContactSec["<b>ContactSection</b> [Client]<br/>components/sections/contact.tsx"]
        ContactSec --> Social["<b>SocialLinks</b> [Client]<br/>components/social-links.tsx"]
        ContactSec --> LinearCard["<b>ProjectCardLinear</b> [Client]<br/>components/cards/project-card-linear.tsx"]

        RequestLogo["<b>Request Logo (/request/logo)</b> [Server]<br/>app/request/logo/page.tsx"]
        RequestLogo --> RequestForm["<b>ProjectRequestForm</b> [Client]<br/>components/forms/project-request-form.tsx"]
        RequestForm --> RF1["Section 1: Contact<br/>(name, email, phone)"]
        RequestForm --> RF2["Section 2: Brand<br/>(brandName, description, audience)"]
        RequestForm --> RF3["Section 3: Design<br/>(keywords, feelings, type, colors)"]
        RequestForm --> RF4["Section 4: Usage<br/>(inspiration, usage, formats)"]
        RequestForm --> RF5["Section 5: Notes"]
        RequestForm --> ThankYou["<b>ThankYouCard</b> [Client]<br/>components/cards/thank-you-card.tsx"]
        RequestForm --> AutoSave["Auto-save via useFormPersistence"]

        ReqStatus["<b>Request Status (/request/[id])</b> [Server]<br/>app/request/[id]/page.tsx<br/>Details + status badge (read-only)"]

        AdminLogin["<b>Admin Login (/admin/login)</b> [Client]<br/>app/admin/login/page.tsx"]
        AdminLogin --> AuthForm["<b>AuthForm</b> [Client]<br/>components/forms/auth-form.tsx<br/>Username, password, submit"]

        AdminDash["<b>Admin Dashboard (/admin)</b> [Server]<br/>app/admin/page.tsx"]
        AdminDash --> StatCards["<b>StatCard</b>[] [Client]<br/>components/cards/stat-card.tsx"]
        AdminDash --> ProjForm["<b>ProjectForm</b> [Client]<br/>components/forms/project-form.tsx<br/>Fields + image upload (XHR to Cloudinary)"]

        AdminReqs["<b>Admin Requests (/admin/requests)</b> [Server]<br/>app/admin/requests/page.tsx"]
        AdminReqs --> AdminReqContent["<b>AdminRequestsContent</b> [Client]<br/>components/sections/admin-requests.tsx"]
        AdminReqContent --> ReqSearch["Search bar"]
        AdminReqContent --> ReqFilter["Status filter tabs"]
        AdminReqContent --> ReqSort["Sort selector"]
        AdminReqContent --> ReqTable["Requests table"]
        ReqTable --> StatusControl["<b>RequestStatusControl</b> [Client]<br/>components/sections/request-status-control.tsx<br/>Status badge → dropdown → PATCH"]
        AdminReqContent --> ReqPagination["Pagination"]
        AdminReqContent --> ReqStats["Stats summary"]
    end

    subgraph Footer["Footer"]
        FooterComp["<b>Footer</b> [Client]<br/>components/layout/footer.tsx"]
        FooterSocial["SocialLinks"]
        FooterCopy["Copyright"]
        FooterComp --> FooterSocial
        FooterComp --> FooterCopy
    end

    subgraph LoadingStates["Loading / Error States"]
        Loading["<b>Loading</b> [Server]<br/>Per-route loading.tsx"]
        Loading --> Skeleton["<b>Skeleton</b> [Client]<br/>components/ui/skeleton.tsx"]
        Skeleton --> CardSkel["<b>ProjectCardSkeleton</b>[] [Client]<br/>components/cards/project-card-skeleton.tsx"]
        Error["<b>ErrorBoundary</b> [Server]<br/>app/error.tsx"]
        Error --> ErrorState["<b>ErrorState</b> [Client]<br/>components/ui/error-state.tsx"]
    end

    Root --> Providers
    Root --> Navigation
    Root --> Pages
    Root --> Footer
    Root --> LoadingStates
```

## shadcn/ui Primitives (`components/ui/*`)

All located in `components/ui/`:

| Component | File | Lines | Notes |
|-----------|------|-------|-------|
| Badge | `badge.tsx` | 35 | Variants: default, secondary, outline, destructive |
| Button | `button.tsx` | 67 | Variants: default, secondary, outline, ghost, link, destructive |
| ButtonGroup | `button-group.tsx` | 40 | Horizontal button grouping |
| Card | `card.tsx` | 112 | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| Checkbox | `checkbox.tsx` | 15 | Radix checkbox |
| DropdownMenu | `dropdown-menu.tsx` | 235 | Full Radix dropdown with trigger, content, items, separators |
| ErrorState | `error-state.tsx` | 64 | Empty, not-found, error variants |
| Input | `input.tsx` | 15 | Styled input |
| InputGroup | `input-group.tsx` | 145 | Search input with icon, clear, suggestions |
| Label | `label.tsx` | 10 | Radix label |
| Separator | `separator.tsx` | 10 | Horizontal rule |
| Skeleton | `skeleton.tsx` | 64 | Loading skeleton |
| Textarea | `textarea.tsx` | 10 | Styled textarea |

## Cards (`components/cards/*`)

| Component | File | Lines | Usage |
|-----------|------|-------|-------|
| `ProjectCardBox` | `project-card-box.tsx` | 71 | Grid project card (projects listing) |
| `ProjectCardLinear` | `project-card-linear.tsx` | 76 | Horizontal card (contact page) |
| `ProjectCardSkeleton` | `project-card-skeleton.tsx` | 57 | Loading placeholder for cards |
| `StatCard` | `stat-card.tsx` | 35 | Dashboard statistic display |
| `ThankYouCard` | `thank-you-card.tsx` | 42 | Success state after form submit |

## Custom Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useApi.ts` | 137 lines | All TanStack Query mutations/queries + `apiRequest` fetch wrapper |
| `useGSAP.ts` | 90 lines | GSAP + ScrollTrigger initialization and cleanup |
| `useFormPersistence.ts` | 34 lines | localStorage form save/restore (debounced 500ms) |

## Animation System

Components use data attributes consumed by `useGSAP`:

```html
<div data-reveal>           <!-- Scroll-triggered fade-in + slide-up -->
<div data-hover-lift>       <!-- Hover: translateY(-4px) shadow lift -->
```

GSAP is initialized with ScrollTrigger plugin. All animations are cleaned up on unmount via GSAP's `ScrollTrigger.refresh()` and `context.revert()`.
