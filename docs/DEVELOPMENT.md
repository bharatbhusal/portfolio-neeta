# Development Guide

How to set up the project, run it locally, and contribute.

## Prerequisites

- **Node.js**: 18.0.0 or higher
  ```bash
  node --version  # Should be v18+
  ```
- **npm**: 9.0.0 or higher
  ```bash
  npm --version
  ```
- **Git**: For version control
- **Code Editor**: VS Code recommended (with ESLint extension)

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/bharatbhusal/portfolio-neeta.git
cd portfolio-neeta
```

### 2. Install Dependencies

```bash
npm install
```

This installs all packages from `package.json` into `node_modules/`.

### 3. Environment Setup

Create `.env.local` file in project root:

```bash
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

**Get Cloudinary Cloud Name**:

1. Create account at https://cloudinary.com (free tier available)
2. Go to Dashboard → Account Details
3. Copy "Cloud Name"
4. Paste into `.env.local`

**For Local Development**: `NEXT_PUBLIC_BASE_URL=http://localhost:3000` is fine.

### 4. Verify Setup

```bash
npm run lint  # Should pass with 0 errors
npm run build # Should complete successfully
```

---

## Development Server

### Start Server

```bash
npm run dev
```

**Note**: Includes `--webpack` flag for PWA support.

**Output**:

```
  ▲ Next.js 16.2.4
  - Local:        http://localhost:3000
  - Environments: .env.local
```

Open http://localhost:3000 in browser.

### Hot Module Replacement (HMR)

- Edit a file → changes appear instantly
- Styling changes apply without refresh
- Component re-renders on save

### Debug Mode

Enable detailed logging:

```bash
DEBUG=* npm run dev  # Verbose output
```

---

## Building for Production

### Build Once

```bash
npm run build
```

**What Happens**:

1. Compiles TypeScript
2. Bundles JavaScript via Webpack (with `--webpack` flag)
3. Optimizes CSS (Tailwind JIT)
4. Creates `.next/` output folder
5. Generates static assets

**Output**:

```
- Compiled client and server successfully
- Created .next folder
- Next.js 16.2.4

Route (kind) Size     First Load JS
─ ○ / (ISR)  15 kB   ...
─ ○ /about (ISR) 8 kB  ...
...
```

### Run Built App Locally

```bash
npm run build
npm start
```

Starts Node.js server on http://localhost:3000.

### Build Troubleshooting

**Error: "webpack not installed"**

- Ensure `next.config.ts` has correct webpack config
- Run `npm install` again

**Error: "TypeScript compilation failed"**

- Run `npm run lint` to see errors
- Fix TypeScript errors before build

---

## Code Quality

### Linting

```bash
npm run lint
```

Checks for:

- Unused variables
- Type mismatches
- React best practices
- Accessibility issues

**Fix Automatically** (some issues):

```bash
npm run lint -- --fix
```

### Type Checking

```bash
npx tsc --noEmit
```

Runs TypeScript without compiling (fast check).

### Code Formatting

(Optional) Format code with Prettier:

```bash
npx prettier --write .
```

---

## File Structure & Editing

### Adding a New Page

1. Create file in `app/route-name/page.tsx`:
   ```typescript
   // app/blog/page.tsx
   export default function BlogPage() {
     return <div>Blog</div>
   }
   ```
2. Automatically routed to `/blog`

### Adding a New Component

1. Create file in `components/section-name/component.tsx`:

   ```typescript
   // components/sections/blog.tsx
   interface BlogProps {
     posts: Post[];
   }

   export function Blog({ posts }: BlogProps) {
     return <section>{/* ... */}</section>
   }
   ```

2. Import in page component:
   ```typescript
   import { Blog } from "@/components/sections/blog";
   ```

### Adding a New Data Source

1. Create JSON file in `public/data/name.json`
2. Define TypeScript type in `types/portfolio.ts`:

   ```typescript
   export interface BlogPost {
   	id: string;
   	title: string;
   	content: string;
   }

   export interface BlogData {
   	posts: BlogPost[];
   }
   ```

3. Fetch in component using `lib/data.ts`:
   ```typescript
   const blogData = await fetchJson<BlogData>(
   	"/public/data/blog.json",
   );
   ```

---

## Server/Client Component Rules

**Default: Server Components**

```typescript
// This is a Server Component by default
export default function MyComponent() {
  const data = fetchSomething(); // ✅ OK: async data fetching

  return <div>{data}</div>
}
```

**Add `'use client'` When You Need**:

- Event handlers (onClick, onChange, etc.)
- React hooks (useState, useEffect, etc.)
- Browser APIs (localStorage, window, etc.)
- Client-side data fetching (useEffect + fetch)

```typescript
'use client';  // Mark as Client Component

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);  // ✅ OK: hooks

  return (
    <button onClick={() => setCount(count + 1)}>  // ✅ OK: onClick
      Count: {count}
    </button>
  );
}
```

**Pass Data from Server → Client**:

```typescript
// ✅ Good: Server fetches, passes to Client
async function ServerPage() {
  const projects = await fetchJson(...);
  return <ClientGrid projects={projects} />;  // Prop is serializable
}

// ❌ Bad: Client fetching (unnecessary, slower)
'use client';
export function ClientGrid() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetch('/api/projects').then(res => res.json()).then(setProjects);
  }, []);
}
```

---

## API Routes & Testing

### Test API Endpoint

**Using curl**:

```bash
curl "http://localhost:3000/api/projects?featured=true"
```

**Using VS Code REST Client** (install extension):
Create `test.http`:

```
GET http://localhost:3000/api/projects?featured=true
```

Right-click → "Send Request"

**Using Browser**:
Visit http://localhost:3000/api/projects in browser (GET only)

### Response Format

Check `docs/API-ROUTES.md` for detailed endpoint specs.

---

## Icons management

### Adding a New Icon

1. Find icon in https://www.npmjs.com/package/react-icons (search)
2. Note the collection and name (e.g., "MdDarkMode" from Material Design)
3. Add to `lib/iconMapper.ts`:

   ```typescript
   import { MdDarkMode } from "react-icons/md";

   export const iconMap = {
   	// ... existing
   	MdDarkMode,
   };
   ```

4. Use in JSON:
   ```json
   { "icon": "MdDarkMode" }
   ```
5. Component automatically resolves via iconMap

### Testing Icon Display

In any component:

```typescript
import { iconMap } from '@/lib/iconMapper';

export function IconTest() {
  return Object.entries(iconMap).map(([name, Icon]) => (
    <div key={name}>
      <Icon className="w-8 h-8" />
      <span>{name}</span>
    </div>
  ));
}
```

Navigate to component in browser; all icons should display.

---

## Debugging

### Browser DevTools

1. Open http://localhost:3000
2. Press `F12` or `Cmd+Option+I` (Mac) to open DevTools
3. Use:
   - **Elements** tab: Inspect HTML
   - **Console** tab: View errors, run JavaScript
   - **Network** tab: View API requests/responses
   - **Lighthouse** tab: Performance audit

### Next.js Debug Panel

Visit http://localhost:3000/**nextjs_error** for compilation errors (if build fails).

### React DevTools Extension

Install "React Developer Tools" from Chrome Web Store.

**In DevTools**:

- **Profiler**: View component render times
- **Components**: Inspect props and state

### GSAP Animations Debug

In `components/animations/reveal.tsx`, uncomment:

```typescript
scrollTrigger: {
  trigger: '.reveal-element',
  start: 'top 80%',
  end: 'bottom 20%',
  markers: true,  // ← Adds debug markers to page
}
```

**Markers** show trigger zones on page; useful for tuning scroll animations.

---

## Common Tasks

### Update Contact Channels

1. Edit `public/data/contact.json`
2. Add entry to `channels[]`:
   ```json
   {
   	"label": "X",
   	"href": "https://x.com/username",
   	"icon": "FaXTwitter" // from react-icons
   }
   ```
3. Register icon in `lib/iconMapper.ts` if new
4. ISR revalidation applies after 1 hour (or `revalidatePath` if deployed)

### Add Project to Portfolio

1. Upload image to Cloudinary dashboard
2. Note public ID (e.g., `portfolio-my-project`)
3. Edit `public/data/projects.json`, add to `projects[]`:
   ```json
   {
   	"key": "my_project.jpeg",
   	"title": "My Project",
   	"description": "...",
   	"shortDescription": "...",
   	"image": "portfolio-my-project",
   	"category": "Web",
   	"tags": ["React", "Next.js"],
   	"year": 2024,
   	"featured": true,
   	"client": "Client Name"
   }
   ```
4. Save; appears on portfolio automatically (after ISR or redeploy)

### Modify Page Styling

1. Edit component file (e.g., `components/sections/hero.tsx`)
2. Update Tailwind classes:
   ```tsx
   {
   	/* Was: className="text-4xl" */
   }
   {
   	/* Now: */
   }
   <h1 className="text-6xl font-bold text-center">
   	Title
   </h1>;
   ```
3. Save; HMR applies change instantly in browser

### Check Build Size

```bash
npm run build
# Output shows:
# Route (kind)              Size     First Load JS
```

If size bloats unexpectedly:

- Check for unused dependencies in `package.json`
- Run `npm audit` to find security issues
- Use Webpack Bundle Analyzer (optional integration)

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup (Vercel, Netlify, self-hosted).

**Quick Summary**:

- Vercel: Push to GitHub → auto-deploy
- Netlify: Connect repo → auto-deploy
- Self-hosted: `npm run build && npm start` on server

---

## Troubleshooting

### Problem: `npm install` fails

**Solution**:

```bash
rm package-lock.json node_modules
npm install
```

Delete lock file and node_modules, then reinstall.

### Problem: Build hangs or times out

**Solution**:

```bash
npm run build 2>&1 | tail -50  # Show last 50 lines of output
```

Check output for specific error. Common causes:

- Infinite loop in component
- Too many large images
- Missing async/await in API route

### Problem: Port 3000 already in use

**Solution**:

```bash
# Use different port
PORT=3001 npm run dev

# Or kill process using port 3000
lsof -i :3000  # Find process
kill -9 <PID>  # Kill it
```

### Problem: TypeScript "Cannot find module" error

**Solution**:

```bash
# Ensure path alias is set in tsconfig.json
"@/*": ["./*"]

# Then restart dev server
npm run dev
```

### Problem: Cloudinary images not loading

**Solution**:

1. Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in `.env.local`
2. Verify image public ID exists in Cloudinary dashboard
3. Check remote patterns in `next.config.ts` (should allow `res.cloudinary.com`)

---

## Performance Optimization Tips

### 1. Lazy Load Components

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./heavy'), {
  loading: () => <div>Loading...</div>,
});

export function Page() {
  return <HeavyComponent />;  // Loads on-demand
}
```

### 2. Memoize Expensive Calculations

```typescript
import { useMemo } from 'react';

const sorted = useMemo(() => {
  return projects.sort(...);  // Only re-sort if projects change
}, [projects]);
```

### 3. Use Next.js Image Component

Always use `next/image` instead of `<img>`:

```typescript
import Image from 'next/image';

<Image
  src={url}
  alt="description"
  width={600}
  height={400}
  quality={80}
/>
```

### 4. Monitor Bundle Size

```bash
npm run build
# Output shows per-route sizes
```

If routes get huge, consider code-splitting.

---

## Git Workflow

### Branch Naming

```
feature/new-feature
fix/bug-description
docs/update-readme
```

### Commit Messages

```
fix: update contact icon mapping
feat: add blog section
docs: add deployment guide
```

Use conventional commit format: `type: description`

### Before Pushing

```bash
npm run lint        # Fix any linter errors
npm run build       # Ensure build succeeds
git status          # Check files to commit
git add .
git commit -m "type: description"
git push origin branch-name
```

---

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com/docs
- **GSAP Docs**: https://greensock.com/docs/
- **Radix UI Docs**: https://www.radix-ui.com/docs/primitives
- **TypeScript Docs**: https://www.typescriptlang.org/docs/

For codebase-specific questions, check:

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [DATA-STRUCTURE.md](./DATA-STRUCTURE.md)
- [PATTERNS.md](./PATTERNS.md)
