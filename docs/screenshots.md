# Page Screenshots & Walkthrough

Viewport screenshots of every page captured on 2026-07-11.

**Live site**: https://neetabhusal.vercel.app  
**Dev server**: http://localhost:3000

Images are in `/public/assets/`. Each page has desktop (1280×800) and mobile (390×844) versions.

---

## Desktop

### Home (`/`)

![Home](/public/assets/home.png)

- **How to get there**: Visit the root URL. Navbar link "Home".
- **What it shows**: Hero section with profile image, tagline, and a "View My Work" call-to-action. GSAP scroll reveals on featured projects and about sections.

### Projects Listing (`/projects`)

![Projects](/public/assets/projects.png)

- **How to get there**: Click "Projects" in the navbar.
- **What it shows**: Paginated project grid (12 per page) with search (debounced), category filter, and sort controls (newest, oldest, A–Z, Z–A).

### Project Detail (`/projects/[id]`)

![Project Detail](/public/assets/project-detail.png)

- **How to get there**: Click any project card from the listing.
- **What it shows**: Full project view with Cloudinary images, story/description, tags, client, year, and a WhatsApp inquiry link.

### Contact (`/contact`)

![Contact](/public/assets/contact.png)

- **How to get there**: Click "Contact" in the navbar.
- **What it shows**: Social links (Instagram, GitHub, LinkedIn), a featured project card, and client project cards.

### Request Logo (`/request/logo`)

![Request Logo](/public/assets/request-logo.png)

- **How to get there**: Navigate to `/request/logo` or find the link on the home page.
- **What it shows**: Multi-step logo design request form with sections for contact info, brand details, design preferences, usage, and additional notes. Auto-saves to localStorage.

### Request Status (`/request/[id]`)

![Request Status](/public/assets/request-status.png)

- **How to get there**: After submitting a logo request, use the tracking link.
- **What it shows**: Read-only view of the submitted request with current status badge (Pending / Reviewed / Accepted / Declined) and all form answers.

### Admin Login (`/admin/login`)

![Admin Login](/public/assets/admin-login.png)

- **How to get there**: Navigate to `/admin/login`.
- **What it shows**: Username/password form. Sign-in sets a JWT httpOnly cookie.

### Admin Dashboard (`/admin`)

![Admin Dashboard](/public/assets/admin.png)

- **How to get there**: Log in with admin credentials and you'll be redirected to `/admin`.
- **What it shows**: Stats cards (total projects, total requests, pending requests) and quick links to manage projects and requests.

### Add New Project (`/admin/projects/new`)

![New Project](/public/assets/admin-projects-new.png)

- **How to get there**: Click "Add Project" from the admin dashboard.
- **What it shows**: Form with fields for key, title, category, story, description, year, tags, client, link, and a drag-and-drop image upload to Cloudinary.

### Edit Project (`/admin/projects/[id]`)

![Edit Project](/public/assets/admin-project-edit.png)

- **How to get there**: Click an existing project from the admin panel.
- **What it shows**: Pre-populated form with the same fields as create. Image replacement is optional.

### Manage Requests (`/admin/requests`)

![Manage Requests](/public/assets/admin-requests.png)

- **How to get there**: Click "Manage Requests" from the admin dashboard.
- **What it shows**: Requests table with columns for brand name, client name, email, status badge, date, and actions. Search, filter by status, sort, paginate. Change status via the status badge dropdown.

---

## Mobile

| Page | Mobile Screenshot |
|------|------------------|
| Home | ![Home Mobile](/public/assets/home-mobile.png) |
| Projects | ![Projects Mobile](/public/assets/projects-mobile.png) |
| Project Detail | ![Project Detail Mobile](/public/assets/project-detail-mobile.png) |
| Contact | ![Contact Mobile](/public/assets/contact-mobile.png) |
| Request Logo | ![Request Logo Mobile](/public/assets/request-logo-mobile.png) |
| Request Status | ![Request Status Mobile](/public/assets/request-status-mobile.png) |
| Admin Login | ![Admin Login Mobile](/public/assets/admin-login-mobile.png) |
| Admin Dashboard | ![Admin Dashboard Mobile](/public/assets/admin-mobile.png) |
| New Project | ![New Project Mobile](/public/assets/admin-projects-new-mobile.png) |
| Edit Project | ![Edit Project Mobile](/public/assets/admin-project-edit-mobile.png) |
| Manage Requests | ![Manage Requests Mobile](/public/assets/admin-requests-mobile.png) |

---

## Email Screenshots

> **Attach email screenshots here.**  
> The app sends transactional emails in these flows:
>
> 1. **Request Confirmation** — sent to the client after submitting `/request/logo`
> 2. **Admin Notification** — sent to the admin when a new request comes in
> 3. **Status Update** — sent to the client when the admin changes request status
>
> Place images in `/public/assets/` and add them below using the same `![Alt](/public/assets/<filename>.png)` format.

---

## Tips

- **Theme**: Dark mode is default. Toggle via the navbar button.
- **Animations**: GSAP scroll reveals are present on the home page and project sections — wait 2–3s for full render.
- **Admin credentials**: Username `neetabhusal`, password `neetabhusal` (dev only).
- **Responsive**: The site is mobile-first. Some forms (request logo, new project) may require scrolling on mobile.
