# Deployment Guide

How to deploy the portfolio to production.

## Overview

This is a Next.js 16 application that can be deployed to:

1. **Vercel** (Recommended; official Next.js hosting)
2. **Netlify** (Via build command)
3. **Self-Hosted** (Any Node.js server)

---

## Vercel (Recommended)

**Why Vercel?**

- Built for Next.js
- Automatic deployments on Git push
- Edge Functions & Middleware support
- Free tier available
- ISR (Incremental Static Regeneration) fully supported

### Prerequisites

- GitHub account with repo pushed
- Vercel account (https://vercel.com)

### Step 1: Connect Repository

1. Go to https://vercel.com/new
2. Select "GitHub"
3. Authenticate with GitHub
4. Search for `portfolio-neeta` repo
5. Click "Import"

### Step 2: Configure Environment Variables

In Vercel Dashboard:

1. Click "Environment Variables"
2. Add:
   ```
   NEXT_PUBLIC_BASE_URL = https://your-domain.com
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = your-cloud-name
   ```
3. Click "Save"

### Step 3: Build Settings

**Vercel auto-detects Next.js settings.**

Verify:

- **Build Command**: `next build --webpack` (should auto-fill)
- **Output Directory**: `.next` (correct)
- **Install Command**: `npm ci` (correct)

### Step 4: Deploy

Click "Deploy"

**Deployment Timeline**:

- Install dependencies (2-3 min)
- Build (`npm run build`) (3-5 min)
- Generate static assets (1-2 min)
- Deploy to CDN (~1 min)

**Result**:

- Live at `https://portfolio-neeta.vercel.app` (or custom domain)
- Automatic deployments on every Git push to `main` branch

### Custom Domain

1. In Vercel Dashboard → "Domains"
2. Add your domain (e.g., `bharatbhusal.com`)
3. Follow DNS setup instructions from your registrar (GoDaddy, Namecheap, etc.)
4. DNS propagates within 24-48 hours

### ISR & Revalidation

```typescript
// In app/api/projects/route.ts
export const revalidate = 60 * 60; // 1 hour ISR

// Deployment:
// - First request: generates page, caches for 1 hour
// - Subsequent requests (0-1 hour): serve cache
// - After 1 hour: regenerate in background, serve cache while generating
```

**On-Demand Revalidation** (if needed):

```typescript
// app/api/revalidate/route.ts
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
	const secret = req.headers.get("Authorization");

	if (secret !== process.env.REVALIDATE_SECRET) {
		return new Response("Unauthorized", { status: 401 });
	}

	revalidateTag("projects");
	return Response.json({ revalidated: true });
}
```

Invoke from GitHub Actions or manually:

```bash
curl -X POST -H "Authorization: secret-token" \
  https://your-domain.com/api/revalidate
```

---

## Netlify

**Why Netlify?**

- Supports Next.js
- Git push auto-deployments
- Free tier available
- Good UI/UX

### Prerequisites

- GitHub account
- Netlify account (https://netlify.com)

### Step 1: Connect Repository

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Select GitHub
4. Find and select `portfolio-neeta` repo

### Step 2: Build Settings

Set build parameters:

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 20 (via `.nvmrc` in repo root)

### Step 3: Environment Variables

In Netlify Dashboard → "Site Settings" → "Build & Deploy" → "Environment":

```
NEXT_PUBLIC_BASE_URL = https://your-domain.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = your-cloud-name
```

### Step 4: Deploy

Click "Deploy"

**Result**:

- Live at `https://your-app.netlify.app`
- Auto-deploys on Git push

### Custom Domain

1. "Site settings" → "Domain management"
2. Add custom domain
3. Update DNS at registrar
4. SSL certificate auto-generated

---

## Self-Hosted (VPS, Docker, etc.)

For DigitalOcean, AWS EC2, Linode, or any VPS.

### Prerequisites

- Server with Node.js 18+ installed
- SSH access to server
- Domain DNS pointing to server IP

### Step 1: Clone Repository

```bash
ssh your-domain.com

# On server:
cd /var/www
git clone https://github.com/bharatbhusal/portfolio-neeta.git
cd portfolio-neeta
```

### Step 2: Install Dependencies

```bash
npm ci  # Use lock file exactly
```

### Step 3: Create `.env.production`

```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Step 4: Build

```bash
npm run build
```

**Output**: `.next/` folder with compiled app

### Step 5: Start Server

**Option A: Direct Node.js**

```bash
npm start
# Server runs on http://localhost:3000
```

**Option B: PM2 (Recommended for background process)**

```bash
npm install -g pm2

pm2 start "npm start" --name "portfolio"
pm2 save
pm2 startup
```

Restarts automatically if server reboots or process crashes.

**Option C: Docker**

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build & run:

```bash
docker build -t portfolio-neeta .
docker run -p 3000:3000 -e NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx portfolio-neeta
```

### Step 6: Reverse Proxy (Nginx/Apache)

**Nginx** (recommended):

```nginx
# /etc/nginx/sites-available/your-domain
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable & restart:

```bash
sudo ln -s /etc/nginx/sites-available/your-domain /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: SSL Certificate (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Auto-renews every 90 days.

### Step 8: Set Up Auto-Deployment (Optional)

**GitHub Actions to VPS**:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
 push:
  branches: [main]

jobs:
 deploy:
  runs-on: ubuntu-latest
  steps:
   - uses: actions/checkout@v3

   - name: Deploy via SSH
     uses: appleboy/ssh-action@master
     with:
      host: ${{ secrets.VPS_HOST }}
      username: ${{ secrets.VPS_USER }}
      key: ${{ secrets.VPS_SSH_KEY }}
      script: |
       cd /var/www/portfolio-neeta
       git pull origin main
       npm ci
       npm run build
       pm2 restart portfolio
```

Add secrets to GitHub:

- `VPS_HOST` — Your server IP
- `VPS_USER` — SSH username
- `VPS_SSH_KEY` — Private SSH key

Git push → auto-deploys to VPS!

---

## Environment Variables

### Required

```
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-account
```

Both must be public (`NEXT_PUBLIC_` prefix) because they're used in browser.

### Optional

(None currently; add as needed)

### Getting Cloudinary Cloud Name

1. Cloudinary Dashboard → Account → Settings
2. Find "Cloud Name" (e.g., `bharat-cloud`)
3. Copy to env

---

## Performance Checklist

Before going live:

- [ ] `npm run build` succeeds
- [ ] `npm run lint` has 0 errors
- [ ] All images load from Cloudinary
- [ ] Contact form works
- [ ] SEO metadata present (check page source)
- [ ] SSL certificate valid (HTTPS)
- [ ] ISR revalidation working (1-hour cache)
- [ ] Analytics configured (if using)
- [ ] Error monitoring configured (if using)

---

## Monitoring & Debugging

### View Logs

**Vercel**:

1. Dashboard → Deployments
2. Find latest deployment
3. Click → View Logs

**Netlify**:

1. Netlify Admin → Deploys
2. Find latest deploy
3. Click → Deploy Log

**Self-Hosted (PM2)**:

```bash
pm2 logs
```

**Self-Hosted (Nginx)**:

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Monitor Performance

**Use Lighthouse** (free, in Chrome DevTools):

1. DevTools → Lighthouse
2. Generate report
3. Check:
   - Performance (>90)
   - Accessibility (>95)
   - Best Practices (>90)
   - SEO (>95)

### Error Reporting

Set up error tracking (optional):

- **Sentry** (error tracking, performance monitoring)
- **LogRocket** (session replay)
- **Datadog** (infrastructure monitoring)

---

## Rollback & Hotfixes

### Vercel Rollback

1. Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Rollback to this"

### GitHub Rollback

```bash
git revert HEAD  # Create new commit with previous version
git push         # Auto-deploys reverted code
```

### Hotfix without Revert

```bash
git checkout -b hotfix/bug-fix
git add .
git commit -m "fix: urgent bug"
git push origin hotfix/bug-fix
# Create Pull Request, merge to main
```

---

## Maintenance

### Regular Tasks

**Weekly**:

- Check error logs
- Monitor performance metrics

**Monthly**:

- Update dependencies: `npm update`
- Run security audit: `npm audit`
- Backup data (Cloudinary images)

**Quarterly**:

- Major version updates
- SEO audit
- Performance optimization

### Dependency Updates

```bash
# Check outdated packages
npm outdated

# Update minor & patch versions
npm update

# Update major version (breaking changes)
npm install package@latest

# Audit for vulnerabilities
npm audit
npm audit fix
```

---

## Troubleshooting Deployment

### Build Fails on Vercel

**Check**:

1. `npm run build` succeeds locally
2. `.env.local` variables not committed (use `.env.example` instead)
3. TypeScript errors: `npm run lint`
4. Webpack flag in build script

**Fix**:

```bash
git push  # Re-trigger deploy with fixes
```

### 404 Errors After Deploy

**Check**:

1. Routes match file structure (`app/about/page.tsx` → `/about`)
2. Dynamic routes use `[param]` syntax
3. ISR revalidation hasn't cached 404

**Fix**:

```bash
# Soft reset ISR cache
npm run build
```

### Images Not Loading

**Check**:

1. `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` set correctly
2. Image public IDs exist in Cloudinary
3. Remote patterns allow `res.cloudinary.com`

**Fix**:

```javascript
// next.config.ts — verify this exists:
images: {
  remotePatterns: [{
    protocol: 'https',
    hostname: 'res.cloudinary.com',
    pathname: '/**',
  }],
}
```

### Slow Deployments

**Check**:

1. Dependencies size (`npm ls --depth=0`)
2. Build time in logs
3. ISR revalidation time

**Optimize**:

- Remove unused dependencies
- Use lazy-loaded components
- Enable React Compiler (already enabled)

---

## Summary

| Platform        | Complexity     | Best For                     | Cost             |
| --------------- | -------------- | ---------------------------- | ---------------- |
| **Vercel**      | ⭐ Easy        | Small teams, rapid iteration | Free tier + paid |
| **Netlify**     | ⭐ Easy        | Simple deployments           | Free tier + paid |
| **Self-Hosted** | ⭐⭐⭐ Complex | Full control, custom setup   | $5-20/month VPS  |

**Recommendation for Portfolio**: Use Vercel (easy, fast, free tier sufficient).
