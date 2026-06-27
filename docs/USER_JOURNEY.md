# User Journeys

## 1. Visitor — Browse Portfolio

```mermaid
flowchart TD
    Home["Landing Page (/)"] --> Hero["View Hero section<br/>profile + tagline"]
    Home --> Projects["Navigate to Projects (/projects)"]
    Home --> Contact["Navigate to Contact (/contact)"]
    Home --> Request["Navigate to Request Logo (/request/logo)"]

    Projects --> Grid["See project grid<br/>(paginated, 12/page)"]
    Grid --> Search["Search by title<br/>(debounced, live)"]
    Grid --> Filter["Filter by category"]
    Grid --> Sort["Sort: newest/oldest/A-Z/Z-A"]
    Grid --> Click["Click a project card"]
    Click --> Detail["Project Detail (/projects/[id])"]
    Detail --> Images["View images (Cloudinary)"]
    Detail --> Story["Read story + description"]
    Detail --> Tags["See tags, client, year"]
    Detail --> WhatsApp["'Inquire About This Project'<br/>→ WhatsApp link"]
    Detail --> Back["Back to projects"]

    Contact --> Social["View social links<br/>Instagram, GitHub, LinkedIn"]
    Contact --> FeaturedCard["View featured project card"]
    Contact --> ClientCards["View client project cards"]

    Request -.->|See Client Journey| ClientJourney
```

### Touchpoints
- All pages have sticky navbar with nav links
- Footer with social links and copyright
- GSAP scroll reveals on key sections
- Dark mode (default) / light mode toggle in navbar

---

## 2. Client — Submit Logo Design Request

```mermaid
flowchart TB
    subgraph Form["Request Logo Page (/request/logo)"]
        S1["Section 1: Contact<br/>Name*, Email*, Phone"]
        S2["Section 2: Brand Details<br/>Brand Name*, Description, Audience"]
        S3["Section 3: Design Preferences<br/>Keywords, Feelings, Logo Type, Colors, Symbols"]
        S4["Section 4: Usage & Delivery<br/>Inspiration, Usage Platforms, File Formats"]
        S5["Section 5: Additional Notes"]
        Save["Auto-save to localStorage<br/>(debounced 500ms)"]

        S1 --> S2 --> S3 --> S4 --> S5
        S5 --> Save
    end

    Submit["Submit"] --> Validate{"Zod Validation"}
    Validate -->|Invalid| Errors["Show field errors"]
    Validate -->|Valid| Success["Success"]

    Success --> ThankYou["Thank You card<br/>with request ID"]
    ThankYou --> Track["Link to /request/[id]<br/>track status"]
    Success --> EmailClient["Email: Confirmation to client"]
    Success --> EmailAdmin["Email: Notification to admin"]
```

### Form Persistence
- Draft saved to `localStorage` on every field change (debounced 500ms)
- On remount, saved data restored automatically
- Cleared on successful submission
- Survives page refresh, navigation away, browser close

---

## 3. Client — Track Request Status

```
Request Status Page (/request/[id])
    │
    ├── View request details (read-only)
    │   ├── Brand name, description, preferences
    │   ├── Current status badge
    │   └── All submitted answers displayed
    │
    └── Status updates when admin changes status
            │
            ├── Email notification sent to client
            └── Page reflects new status on refresh
```

### Status Progression

```mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Reviewed
    Reviewed --> Accepted
    Reviewed --> Declined
    Accepted --> [*]
    Declined --> [*]
```

---

## 4. Admin — Authentication

```mermaid
flowchart TD
    Login["Admin Login (/admin/login)"] --> Enter["Enter username + password"]
    Enter --> Zod["Zod Validation"]
    Zod -->|Invalid| Errors["Show error message"]
    Zod -->|Valid| Submit["POST /api/auth/login"]
    Submit --> Check{"Credentials valid?"}
    Check -->|No| Errors
    Check -->|Yes| Success["Set JWT httpOnly cookie"]
    Success --> Redirect["Redirect to /admin<br/>or ?next= param"]
    Login --> FirstTime["First-time only:<br/>Signup via script<br/>(DISABLE_ONBOARDING=true after)"]
```

### Session
- JWT cookie: httpOnly, secure (production), sameSite "lax"
- Max age: 30 days (configurable)
- Middleware auto-redirects to login if cookie missing/invalid
- Logout via "Sign Out" button → POST /api/auth/logout

---

## 5. Admin — Dashboard

```
Admin Dashboard (/admin)
    │
    ├── Stats cards: total projects, total requests, pending requests
    │
    ├── Quick actions
    │   └── Link to Manage Requests
    │
    └── Links to admin sections
```

---

## 6. Admin — Manage Projects

```
Admin Projects (no dedicated page — managed via Dashboard)
    │
    ├── Create Project
    │   ├── Fill form: key*, title*, category, story, description, year, tags, client, link
    │   ├── Upload image (drag-and-drop or file picker)
    │   │       │
    │   │       ├── Client-side: fetch signed signature from /api/images/signature
    │   │       ├── Rename file with UUID
    │   │       ├── Upload to Cloudinary via XHR (with progress bar)
    │   │       └── Store returned publicId as project.key
    │   │
    │   └── Submit → POST /api/projects → invalidate projects query cache
    │
    └── Edit Project
        ├── Load existing project data
        ├── Modify fields (same as create)
        ├── Replace image (optional)
        └── Submit → PATCH /api/projects/[id] → invalidate projects query cache
```

---

## 7. Admin — Manage Requests

```
Admin Requests (/admin/requests)
    │
    ├── Requests table with columns: brandName, name, email, status, date, actions
    │
    ├── Search by name, email, or brand name (debounced)
    │
    ├── Filter by status (All, Pending, Reviewed, Accepted, Declined)
    │
    ├── Sort by newest, oldest, brand name A-Z, status A-Z
    │
    ├── Pagination (10 per page)
    │
    └── Status change
            │
            ├── Click status badge → dropdown menu
            ├── Select new status (pending/reviewed/accepted/declined)
            ├── PATCH /api/requests/[id] → invalidate requests query cache
            └── Email sent to client: status update notification
```

---

## Flow Diagram

```mermaid
graph LR
    subgraph Visitor["Visitor"]
        Browse["Browse Portfolio"]
        View["View Projects"]
        Contact["Contact"]
    end

    subgraph Portfolio["Portfolio (Public)"]
        Projects["/projects"]
        ContactPage["/contact"]
        Track["/request/[id]"]
    end

    subgraph Admin["Admin"]
        Login["Login / Dashboard"]
        ManageP["Manage Projects"]
        ManageR["Manage Requests"]
        Stats["View Stats"]
    end

    subgraph RequestFlow["Logo Design Request"]
        Logo["/request/logo"]
        Submit["Submit form"]
        Confirm["Confirmation + Email"]
        Logo --> Submit --> Confirm
    end

    Visitor --> Portfolio
    Portfolio <--> Admin
    Visitor --> RequestFlow
    Portfolio --> RequestFlow
```
