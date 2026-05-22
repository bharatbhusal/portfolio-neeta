# Architecture

## System Architecture

```mermaid
graph TB
    User["👤 User Browser"]
    NextApp["⚙️ Next.js 16 App<br/>(force-dynamic)"]

    Pages["📄 Page Components<br/>(Server)"]
    Sections["🎨 Section Components<br/>(Client + Server)"]
    Cards["🃏 Card Components<br/>(Client)"]

    APIRoutes["🔌 API Routes"]
    JSONData["📋 JSON Data<br/>/public/data"]

    Cloudinary["☁️ Cloudinary CDN<br/>Images"]

    User -->|HTTP Request| NextApp
    NextApp -->|Route| Pages
    Pages -->|Import| Sections
    Pages -->|Import| APIRoutes
    Sections -->|Render| Cards
    Pages -->|fetch()| JSONData
    APIRoutes -->|read| JSONData
    Pages -->|Image URLs| Cloudinary
    Cards -->|Image URLs| Cloudinary

    Cloudinary -->|Image Data| User
    NextApp -->|HTML/CSS/JS| User
```

## Data Flow

```mermaid
sequenceDiagram
    participant Browser
    participant NextServer as Next.js Server
    participant FileSystem as /public/data/*.json
    participant Cloudinary as Cloudinary CDN

    Browser ->>+ NextServer: GET /projects
    NextServer ->>+ FileSystem: fetch /projects.json
    FileSystem -->>- NextServer: JSON + project keys
    NextServer ->> NextServer: Transform + Sort<br/>featured first, then key
    NextServer -->>- Browser: HTML + Cache headers

    Browser ->>+ Cloudinary: GET image?public_id
    Cloudinary -->>- Browser: Image binary
    Browser ->> Browser: Render page + images
```

## Component Hierarchy

```mermaid
graph TD
    RootLayout["🔧 app/layout.tsx<br/>(Root Layout)<br/>dynamic: force-dynamic"]
    Navbar["Navbar<br/>(Server)"]
    MainContent["<slot />"]
    Footer["Footer<br/>(use client)"]

    HomePage["Home Page<br/>app/page.tsx"]
    HeroSection["Hero<br/>(use client)"]
    AboutSection["About<br/>(Server)"]
    WorkGrid["Work Grid<br/>(Server)"]
    ProjectCard["Project Card<br/>(use client)"]

    ProjectsPage["Projects Page<br/>app/projects/page.tsx"]
    ProjectsGrid["Projects Grid"]

    ContactPage["Contact Page<br/>app/contact/page.tsx"]
    ContactSection["Contact Section<br/>(use client)"]
    ChannelsGrid["Channels Grid"]
    ProjectsList["Client Projects List"]
    FeaturedProject["Featured Project<br/>via ProjectCard"]

    RootLayout --> Navbar
    RootLayout --> MainContent
    RootLayout --> Footer

    MainContent --> HomePage
    MainContent --> ProjectsPage
    MainContent --> ContactPage

    HomePage --> HeroSection
    HomePage --> AboutSection
    HomePage --> WorkGrid
    WorkGrid --> ProjectCard

    ProjectsPage --> ProjectsGrid
    ProjectsGrid --> ProjectCard

    ContactPage --> ContactSection
    ContactSection --> ChannelsGrid
    ContactSection --> ProjectsList
    ContactSection --> FeaturedProject
    FeaturedProject --> ProjectCard
```

## Request-Response Cycle (Example: `/projects`)

```mermaid
sequenceDiagram
    participant User as Browser
    participant Renderer as NextRenderer
    participant Server as Server Component
    participant FetchLib as lib/data.ts
    participant Cache as ISR Cache<br/>1 hour
    participant FS as Filesystem

    User ->> Renderer: GET /projects
    Renderer ->> Server: Render page.tsx

    alt Cache Hit
        Server ->> Cache: Check cache
        Cache -->> Server: Return cached JSON
    else Cache Miss or Expired
        Server ->> FetchLib: fetchJson(path)
        FetchLib ->> FS: fs.readFile /projects.json
        FS -->> FetchLib: File contents
        FetchLib ->> FetchLib: JSON.parse + validate
        FetchLib -->> Server: Typed data
        Server ->> Cache: Store + set ISR<br/>revalidate: 3600
    end

    Server ->> Server: Sort projects<br/>featured first, key
    Server ->> Renderer: Return JSX with data
    Renderer -->> User: HTML + CSS + JS

    User ->> User: Render + Load images<br/>from Cloudinary
```

## File Processing Pipeline

```mermaid
graph LR
    A["📋 public/data/<br/>project.json"]
    B["🔄 API Route<br/>app/api/projects"]
    C["✅ Validation<br/>types/portfolio.ts"]
    D["📊 Transform<br/>Sort + Filter"]
    E["📦 JSON Response"]
    F["🎨 Component<br/>Receives data"]

    A -->|read| B
    B -->|parse| C
    C -->|success| D
    D -->|array| E
    E -->|fetch| F
```

## Styling Pipeline

```
Tailwind CSS 4
    ↓
PostCSS (postcss.config.mjs)
    ↓
Component Classes
    ↓
CVA (class-variance-authority)
    ↓
clsx + tailwind-merge
    ↓
Final CSS Classes
```

## Client/Server Component Boundaries

```mermaid
graph TB
    subgraph Server ["🖥️ Server Components<br/>(default)"]
        PageRoot["app/page.tsx<br/>app/about/page.tsx<br/>app/projects/page.tsx"]
        Layout["app/layout.tsx"]
        Sections["components/sections/about.tsx<br/>components/sections/work-grid.tsx"]
        APIRoutes["app/api/*"]
    end

    subgraph Client ["💻 Client Components<br/>use client"]
        Interactive["components/sections/contact.tsx<br/>components/sections/hero.tsx<br/>components/cards/project-card.tsx<br/>components/layout/footer.tsx"]
        Animations["components/animations/reveal.tsx<br/>hooks/useGSAP.ts"]
        UIComps["components/ui/*<br/>with event handlers"]
    end

    Server -->|passes props| Client
    Client -->|events| Client
    Server -->|no events| Server
```

## Key Architectural Decisions

### 1. Server-First Data Fetching

- **Why**: Single source of truth, no client-side race conditions
- **How**: `lib/data.ts` with ISR caching (1 hour revalidation)
- **Result**: Data consistency across all pages

### 2. Centralized Type Definitions

- **Why**: Single TypeScript interface for all data structures
- **How**: All types in `types/portfolio.ts`
- **Result**: Compile-time safety; catch schema changes immediately

### 3. JSON-Driven Content

- **Why**: Enables non-developer content updates without code changes
- **How**: JSON files in `/public/data/`, loaded at build/ISR time
- **Result**: Separates content from presentation

### 4. Icon Mapping Layer

- **Why**: Decouples icon names from component imports
- **How**: Centralized `lib/iconMapper.ts` with static Record
- **Result**: Can swap icon libraries with one file change

### 5. Lazy Animation Setup

- **Why**: Animations shouldn't block initial page render
- **How**: GSAP ScrollTrigger created on scroll events via `useGSAP`
- **Result**: Fast First Contentful Paint (FCP)

### 6. Force-Dynamic Root Layout

- **Why**: Portfolio content changes; static generation not appropriate
- **How**: `dynamic: "force-dynamic"` in app/layout.tsx
- **Result**: Always fresh content without manual ISR purge

## Performance Considerations

### Image Loading

- Cloudinary CDN handles resizing and caching
- Unoptimized Image component (no Next.js optimization layer)
- Reason: Cloudinary already URL-based; double optimization unnecessary

### Data Fetching

- Cached via ISR for 1 hour
- API routes reuse JSON file reads
- Parallel fetching in components where appropriate

### Bundling

- React Compiler (babel-plugin-react-compiler) auto-memos components
- Tree-shaking enabled for unused react-icons
- CSS pruning via Tailwind JIT mode

## Build System

```
Development:  npm run dev        → Next.js dev server with HMR
Build:        npm run build      → next build --webpack
Production:   next start         → Node.js HTTP server
```

**Note**: `--webpack` flag required for PWA support; do not remove from build scripts.
