# Architecture — High-Level Design

> **Portfolio Neeta** — Full-stack portfolio site with admin CMS.

## System Overview

```mermaid
graph TB
    subgraph Browser["Browser"]
        UI["User Interface"]
    end

    subgraph NextJS["Next.js 16 (App Router)"]
        direction TB
        Public["Public Pages<br/>(SSR/ISR)"]
        Admin["Admin Pages<br/>(CSR)"]
        API["API Routes<br/>(/api/*)"]

        subgraph Middleware["Middleware (proxy.ts)"]
            MW["JWT Cookie Check<br/>Protects /admin/*"]
        end

        Public & Admin & API --> MW

        subgraph Backend["Backend Layers"]
            direction LR
            R["Route"] --> C["Controller"]
            C --> S["Service"]
            S --> Repo["Repository"]
            Repo --> M["Mongoose Model"]
        end

        API --> Backend
    end

    subgraph External["External Services"]
        CDN["Cloudinary<br/>(Images)"]
        DB["MongoDB<br/>(Database)"]
        Email["SMTP / Nodemailer"]
    end

    Backend --> DB
    Backend --> CDN
    Backend --> Email
    Browser --> NextJS
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Full-stack React framework |
| **UI Library** | React 19, shadcn/ui (Radix) | Component primitives |
| **Styling** | Tailwind CSS v4, CSS variables | Utility-first + design tokens |
| **Database** | MongoDB + Mongoose 8 | Document store |
| **Auth** | JWT (jsonwebtoken + jose), bcryptjs | Stateless auth |
| **Client State** | TanStack React Query 5 | Server state cache |
| **Validation** | Zod 3 | Schema validation |
| **Image CDN** | Cloudinary | Upload + transform + delivery |
| **Animations** | GSAP 3.15 + ScrollTrigger | Scroll reveals, hover fx |
| **Email** | Nodemailer | SMTP notifications |
| **Analytics** | Vercel Analytics | Usage tracking |
| **Theme** | next-themes | Dark/light mode |
| **Icons** | react-icons, radix-icons | Icon components |
| **Lint** | ESLint 9 (flat config) | Code quality |

## Layered Backend Pattern

Every API route follows the same pipeline:

```mermaid
flowchart TB
    subgraph Request["HTTP Request"]
        direction LR
        Body["Body + Params"]
    end

    Route["API Route<br/>(app/api/*/route.ts)<br/>Parses request, extracts params"]
    Controller["Controller<br/>(controllers/*)<br/>Connects DB, Zod validation, calls service"]
    Service["Service<br/>(services/*)<br/>Business logic, auth checks, image signing"]
    Repository["Repository<br/>(repositories/*)<br/>Mongoose queries"]
    Model["Mongoose Model<br/>(models/*)<br/>Schema definition & validation"]

    Request --> Route --> Controller --> Service --> Repository --> Model
    Model -.->|Response| Repository -.-> Service -.-> Controller -.-> Route -.->|JSON Response| Client
```

### Why This Pattern

- **Separation of concerns** — Each layer has a single responsibility
- **Testability** — Services and repositories can be tested independently
- **Consistency** — Every endpoint follows the same structure
- **Thin routes** — Routes only parse requests, never contain business logic

## Rendering Strategy

| Page Type | Rendering | Data Source |
|-----------|-----------|-------------|
| Home (`/`) | Server | `public/site.json` (cached) |
| Projects (`/projects`) | Server | MongoDB via controller |
| Project Detail (`/projects/[id]`) | Server | MongoDB via controller |
| Contact (`/contact`) | Server | `public/site.json` (cached) |
| Request Logo (`/request/logo`) | Server (form is client) | Zod validation |
| Request Status (`/request/[id]`) | Server | MongoDB via controller |
| Admin Dashboard (`/admin`) | Server (via client query) | TanStack Query → API |
| Admin Login (`/admin/login`) | Client | TanStack Query → API |
| Admin Requests (`/admin/requests`) | Server (via client query) | TanStack Query → API |

## Data Flow Diagrams

### Public Pages (e.g., Projects Listing)

```mermaid
sequenceDiagram
    participant Browser
    participant Server as Server Component
    participant Controller
    participant Service
    participant DB as MongoDB

    Browser->>Server: GET /projects
    Server->>Controller: getProjects(search, category, sort, page)
    Controller->>Service: getProjects(filter, sort, pagination)
    Service->>DB: query with filter + pagination
    DB-->>Service: raw projects
    Service->>Service: hydrateProject()<br/>(add Cloudinary URLs)
    Service-->>Controller: hydrated projects + total
    Controller-->>Server: paginated response
    Server-->>Browser: server-rendered HTML
    Note over Browser,Server: Client component handles search/filter/sort<br/>via URL search params (no TanStack Query)
```

### Admin CRUD (e.g., Create Project)

```mermaid
sequenceDiagram
    participant Browser
    participant TanStack as TanStack Query
    participant API as API Route
    participant Controller
    participant Service
    participant DB as MongoDB

    Browser->>TanStack: useCreateProject() mutation
    TanStack->>API: POST /api/projects
    API->>Controller: createProjectController()
    Controller->>Service: createProject(data)
    Service->>DB: ProjectModel.create(data)
    DB-->>Service: new project
    Service-->>Controller: project
    Controller-->>API: success response
    API-->>TanStack: { success, data }
    TanStack->>TanStack: invalidateQueries(['projects'])
    TanStack-->>Browser: UI update
```

### Image Upload Flow

```mermaid
sequenceDiagram
    participant Admin
    participant Page as Admin Page
    participant API as GET /api/images/signature
    participant Server
    participant Cloudinary

    Admin->>Page: Select image file
    Page->>API: fetch signature
    API->>Server: generate signed signature
    Server-->>API: { signature, timestamp, cloudName, apiKey }
    API-->>Page: signed payload
    Page->>Page: rename file with crypto.randomUUID()
    Page->>Cloudinary: XHR upload (signed)
    Note over Page,Cloudinary: Progress tracking via xhr.upload.onprogress
    Cloudinary-->>Page: { publicId, secure_url }
    Page->>Page: store publicId as project.key
    Note over Page: Later: hydrateProject() builds<br/>imageUrl + downloadUrl with transforms
```

## Caching Strategy

| Cache Layer | Mechanism | Duration |
|-------------|-----------|----------|
| `site.json` | React `cache()` + ISR | `revalidate = 3600` (1 hour) |
| TanStack Query | Memory cache | `staleTime: 5 * 60 * 1000` (5 min) |
| Cloudinary images | CDN edge cache | Cloudinary-managed |
| Next.js pages | ISR (Incremental Static Regeneration) | Per-route revalidate |

## Directory Layout (Key)

```
app/            Next.js App Router (pages + API routes)
components/     React components (layout, sections, cards, forms, ui)
controllers/    Request handling orchestration
services/       Business logic layer
repositories/   Data access layer (Mongoose queries)
models/         Mongoose schema definitions
hooks/          Custom React hooks (TanStack, GSAP, form persistence)
lib/            Utilities, helpers, config accessors, email, Cloudinary
types/          TypeScript type definitions
styles/         Global CSS with Tailwind v4 theme variables
scripts/        Utility scripts (seed, CLI helpers)
public/         Static assets + site.json content config
```
