# Deployment Guide

## Prerequisites

- Node.js 20+
- MongoDB (Atlas recommended for production)
- Cloudinary account
- SMTP provider (Gmail recommended for development)
- Vercel account (or any Node.js hosting)

## Environment Variables

Copy `.env.example` to `.env` and fill all values:

```bash
cp .env.example .env
```

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/portfolio-neeta` |
| `JWT_SECRET` | Secret key for JWT signing | Generate with: `openssl rand -hex 32` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abc123...` |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CLOUDINARY_FOLDER_NAME` | — | Upload folder in Cloudinary |
| `AUTH_COOKIE_NAME` | `nb_auth` | Auth cookie name |
| `JWT_MAX_AGE` | `2592000` | JWT lifetime (30 days in seconds) |
| `DISABLE_ONBOARDING` | `true` | Disable signup after initial setup |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP server |
| `SMTP_PORT` | `465` | SMTP port |
| `SMTP_MAIL_ID` | — | SMTP email address |
| `SMTP_PASSWORD` | — | SMTP app password |

## Production Checklist

### 1. MongoDB
- Use MongoDB Atlas (free tier is sufficient)
- Whitelist Vercel deployment IPs or use VPC peering
- Set `MONGODB_URI` in Vercel environment variables

### 2. Cloudinary
- Create a Cloudinary account
- Note cloud name, API key, and API secret
- Set up an upload folder (optional but recommended)
- Add all 3 credentials to Vercel environment variables

### 3. Authentication
- Generate a strong JWT secret: `openssl rand -hex 32`
- Run signup once locally to create admin user
- Set `DISABLE_ONBOARDING=true` in production

### 4. Email (SMTP)
- For Gmail: Enable 2FA → Generate App Password
- For production: Consider SendGrid, Mailgun, or AWS SES
- Set all SMTP variables in Vercel

### 5. Custom Domain (optional)
- Add domain in Vercel dashboard
- Configure DNS (Vercel provides nameservers or CNAME)
- Update `NEXT_PUBLIC_SITE_URL` if applicable

## Vercel Deployment

### Automatic (Git Integration)
1. Push repo to GitHub
2. Import project in Vercel dashboard
3. Add all environment variables
4. Build command: `npm run build`
5. Output directory: `.next`
6. Deploy

### Manual (CLI)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Build Command
```bash
npm run build
# runs: next build --webpack
```

## Local Development

```bash
# Install dependencies
npm install

# Copy env vars
cp .env.example .env
# Edit .env with your values

# Run dev server
npm run dev
# → http://localhost:3000
```

## Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev --webpack` | Development server |
| `build` | `next build --webpack` | Production build |
| `start` | `next start` | Start production server |
| `lint` | `eslint` | Lint all files |

### Utility Scripts (`scripts/`)

| Script | Purpose |
|--------|---------|
| `seed.js` | Seed 100 random project requests (dev/testing) |
| `login.js` | CLI login to get auth cookie |
| `lib.js` | Shared HTTP helper for scripts |

Run with Node:
```bash
node scripts/seed.js
node scripts/login.js
```

## Domain

- **Production:** https://neetabhusal.vercel.app
- **Repository:** https://github.com/bharatbhusal/portfolio-neeta

## Troubleshooting

| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| Build fails | Missing env vars | Ensure all required vars are set in Vercel |
| Cannot login | Wrong JWT_SECRET | Regenerate or use same secret as signup |
| Image upload fails | Cloudinary credentials | Verify cloud name, API key, secret |
| Emails not sending | SMTP misconfigured | Check SMTP host, port, credentials |
| MongoDB connection fails | IP not whitelisted | Add Vercel IPs to Atlas whitelist |
| Stale data | ISR cache | Wait for revalidation or redeploy |

## Security Notes

- JWT secret should be at least 32 random characters
- Always set `DISABLE_ONBOARDING=true` after creating admin account
- Use httpOnly cookies for auth tokens
- Cloudinary API secret must never be exposed client-side
- Enable MongoDB Atlas IP whitelist
- Use HTTPS in production (Vercel handles this automatically)
