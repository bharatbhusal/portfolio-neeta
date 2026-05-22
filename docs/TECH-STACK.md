# Technology Stack

Complete inventory of all dependencies and their rationale.

## Core Framework

| Package      | Version  | Purpose                         | URL                            |
| ------------ | -------- | ------------------------------- | ------------------------------ |
| `next`       | `16.2.4` | React framework with App Router | https://nextjs.org             |
| `react`      | `19.2.4` | UI library                      | https://react.dev              |
| `react-dom`  | `19.2.4` | React DOM rendering             | https://react.dev              |
| `typescript` | `5.x`    | Type safety                     | https://www.typescriptlang.org |

**Why Next.js 16?**

- App Router (file-based routing)
- Server Components (data fetching at component level)
- Streaming & Progressive Enhancement
- Built-in SEO (metadata, sitemap)
- Hybrid static/dynamic rendering
- React Compiler enabled for auto-optimization

**Quirk**: Build requires `--webpack` flag for PWA support:

```bash
npm run build    # Runs: next build --webpack
npm run dev      # Runs: next dev --webpack
```

---

## Styling

| Package                    | Version | Purpose                              |
| -------------------------- | ------- | ------------------------------------ |
| `tailwindcss`              | `4.x`   | Utility-first CSS                    |
| `postcss`                  | `8.x`   | CSS transformation pipeline          |
| `class-variance-authority` | `0.7.1` | Component variant system (CVA)       |
| `clsx`                     | `2.x`   | Conditional classname utility        |
| `tailwind-merge`           | `2.x`   | Merge Tailwind classes intelligently |

**Why Tailwind?**

- Rapid UI development
- Consistent design system
- Small bundle size
- JIT compilation (only used classes)
- Great for responsive design

**PostCSS Config** (`postcss.config.mjs`):

```javascript
import tailwindcss from "tailwindcss";
export default {
	plugins: {
		tailwindcss: {},
	},
};
```

**Why CVA + clsx + tailwind-merge?**

- CVA: Type-safe component variants
- clsx: Deduplicate & flatten class arrays
- tailwind-merge: Prevent Tailwind conflicts (e.g., `w-full` + `w-96` → `w-96` wins)

**Example**:

```typescript
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva('px-4 py-2 rounded', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-black',
    },
  },
});

// Usage
className={twMerge(buttonVariants({ variant: 'primary' }))}
```

---

## UI Component Library

| Package       | Version | Purpose                                                 |
| ------------- | ------- | ------------------------------------------------------- |
| `@radix-ui/*` | `1.4.3` | Headless UI components (Button, Dialog, Dropdown, etc.) |
| `shadcn/ui`   | Latest  | Radix Nova design system (built on Radix)               |

**Why Radix UI?**

- Unstyled & composable components
- Keyboard navigation & accessibility (WCAG)
- Flexible styling (works with Tailwind)

**shadcn/ui is a collection of Radix-based components** (not imported; components are copied to `components/ui/`)

**Custom Components in codebase**:

- `Button` — CTA buttons with variants
- `Card` — Container with shadow
- `Separator` — Divider line

---

## Animation & Motion

| Package           | Version  | Purpose                       |
| ----------------- | -------- | ----------------------------- |
| `gsap`            | `3.15.0` | Animation library (GreenSock) |
| `@lib/useGSAP.ts` | Custom   | React hook for GSAP lifecycle |

**Why GSAP?**

- Powerful tweening engine
- ScrollTrigger plugin (trigger animations on scroll)
- Hardware acceleration
- Cross-browser consistency
- Better performance than CSS-in-JS

**ScrollTrigger Usage Example**:

```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.to(".element", {
	opacity: 1,
	duration: 1,
	scrollTrigger: {
		trigger: ".element",
		start: "top 80%",
		end: "bottom 20%",
		toggleActions: "play none none none",
		markers: true, // Debug mode
	},
});
```

**Custom Hook** (`hooks/useGSAP.ts`):
Manages GSAP timeline lifecycle (cleanup, context, etc.)

```typescript
useGSAP(() => {
	// GSAP code runs here
	gsap.to(".title", { opacity: 1 });

	return () => {
		// Cleanup (kill timelines)
	};
}, []);
```

---

## Icons

| Package       | Version | Purpose                                      |
| ------------- | ------- | -------------------------------------------- |
| `react-icons` | `5.6.0` | Icon library (Material Design + FontAwesome) |

**Why react-icons?**

- 40,000+ icons (multiple collections)
- Small bundle size (tree-shakeable)
- Easy import: `import { MdMail } from 'react-icons/md'`
- Material Design & FontAwesome included
- No separate icon font download

**Icon Collections Used**:

- `react-icons/md` — Material Design icons (prefix: `Md`)
- `react-icons/fa` — FontAwesome icons (prefix: `Fa`)

**Example Icons in Portfolio**:

```
MdMail      → Email icon
MdPhone     → Phone icon
FaInstagram → Instagram logo
FaLinkedin  → LinkedIn logo
FaFacebook  → Facebook logo
FaPinterest → Pinterest logo
MdArrowOutward → Arrow icon for CTA buttons
```

**Icon Mapping** (`lib/iconMapper.ts`):

```typescript
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

// Usage in components
const iconName = 'MdMail';
const IconComponent = iconMap[iconName];
return <IconComponent className="w-6 h-6" />;
```

---

## Image Handling

| Package      | Version  | Purpose                                    |
| ------------ | -------- | ------------------------------------------ |
| `next/image` | `16.x`   | Next.js Image component                    |
| `cloudinary` | `1.34.0` | Cloudinary SDK (optional; mostly use URLs) |

**Why Unoptimized Next.js Image?**
Project uses `unoptimized: true` in `next.config.ts` because:

1. Cloudinary already handles URL-based resizing
2. Double optimization (Next.js + Cloudinary) unnecessary
3. Simpler URL handling: just pass Cloudinary URL

**Configuration**:

```typescript
// next.config.ts
export default {
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				pathname: "/**",
			},
		],
	},
};
```

**Image URL Format**:

```
https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{TRANSFORMATIONS}/{PUBLIC_ID}.jpg

Example:
https://res.cloudinary.com/bharat-cloud/image/upload/c_fill,w_600,h_450/portfolio-dv-niketan.jpg

Transformations:
- c_fill,w_600,h_450  → Crop to 600×450px
- q_80                → Quality 80%
- f_auto              → Auto format detection
```

---

## Development Tools

| Package                | Version | Purpose                       |
| ---------------------- | ------- | ----------------------------- |
| `eslint`               | `9.x`   | JavaScript linter             |
| `@typescript-eslint/*` | `7.x`   | TypeScript support for ESLint |
| `prettier`             | `3.x`   | Code formatter (optional)     |

**ESLint Config** (`eslint.config.mjs`):
Checks for:

- Unused variables
- Type errors
- React best practices
- Accessibility issues

**Run Linter**:

```bash
npm run lint
```

---

## Build & Optimization

| Package                       | Version | Purpose                               |
| ----------------------------- | ------- | ------------------------------------- |
| `babel-plugin-react-compiler` | `1.0.0` | Auto-memoization for React components |

**React Compiler Effect**:

- Automatically wraps components with `React.memo` where beneficial
- Reduces unnecessary re-renders
- Enables by default; no code changes needed

**Webpack Flag**:

- Both `npm run dev` and `npm run build` use `--webpack` flag
- Enables PWA support (service worker bundling)
- Required for deployment

---

## Optional/Development Dependencies

| Package            | Version | Purpose                        |
| ------------------ | ------- | ------------------------------ |
| `@types/node`      | `20.x`  | TypeScript types for Node.js   |
| `@types/react`     | `19.x`  | TypeScript types for React     |
| `@types/react-dom` | `19.x`  | TypeScript types for React DOM |

---

## Dependency Tree (Simplified)

```
portfolio-neeta
├── next (16.2.4)
│   ├── react (19.2.4)
│   ├── react-dom (19.2.4)
│   └── webpack (bundler; runs with --webpack)
├── tailwindcss (4.x)
│   └── postcss (8.x)
├── @radix-ui/primitive (1.4.3)
│   └── shadcn/ui (custom components)
├── gsap (3.15.0)
│   └── @lib/useGSAP (custom hook)
├── react-icons (5.6.0)
│   ├── react-icons/md (Material Design)
│   └── react-icons/fa (FontAwesome)
├── class-variance-authority (0.7.1)
├── clsx (2.x)
├── tailwind-merge (2.x)
└── cloudinary (1.34.0)
```

---

## Performance Metrics

### Bundle Sizes (Approximate)

| Package     | Gzipped | Notes                                    |
| ----------- | ------- | ---------------------------------------- |
| next        | 400 KB  | Includes React, routing, etc.            |
| tailwindcss | 15 KB   | JIT; only used classes                   |
| react-icons | 30 KB   | Tree-shaken; only imported icons         |
| gsap        | 35 KB   | Animation library                        |
| @radix-ui   | 20 KB   | Headless components (mostly tree-shaken) |
| **Total**   | ~500 KB | Initial page load                        |

### Optimization Strategies

1. **Code Splitting**: Next.js auto-splits per route
2. **Tree Shaking**: Unused code removed via Webpack
3. **React Compiler**: Auto-memoization reduces re-renders
4. **Image Optimization**: Cloudinary handles resizing/caching
5. **CSS Purging**: Tailwind removes unused classes

---

## Version Lock Strategy

**Current Approach**: Loose versioning (e.g., `^16.2.4`)

**Recommendation for Production**:

```json
{
	"dependencies": {
		"next": "16.2.4", // Exact version
		"react": "19.2.4", // Exact version
		"gsap": "3.15.0" // Exact version
	}
}
```

Use `npm ci` (instead of `npm install`) in CI/production to respect lock file exactly.

---

## Migration Notes

### Future: Switching Icon Libraries

If migrating from react-icons to another library:

1. Update `lib/iconMapper.ts` imports:

   ```typescript
   import { Mail, Phone } from "@lucide-react/icons"; // Example
   ```

2. Update icon names in `public/data/contact.json`:

   ```json
   { "icon": "Mail" } // Was "MdMail"
   ```

3. Run tests; ensure all icons render

**Single point of change** makes this easy.

### Future: Switching Styling (Tailwind → CSS-in-JS)

If migrating away from Tailwind:

1. Install alternative (e.g., styled-components, CSS Modules)
2. Update component className → style object
3. Remove Tailwind config; keep CVA pattern for variants

---

## Deployment Environment

**Verified to work on**:

- Vercel (official Next.js hosting)
- Netlify (via build script)
- Self-hosted (Node.js 18+)

**Environment Variables** (see [DEPLOYMENT.md](./DEPLOYMENT.md)):

- `NEXT_PUBLIC_BASE_URL` — Site base URL
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — Cloudinary account

---

## Summary

This stack prioritizes:

- **Developer Experience**: Fast HMR, type safety, great errors
- **Performance**: Auto-memoization, code splitting, CDN images
- **Maintainability**: Typed components, centralized config, responsive UI
- **Scalability**: Modular architecture, easy to add features
- **Accessibility**: Radix UI components, WCAG compliance

No bloat; every dependency serves a purpose.
