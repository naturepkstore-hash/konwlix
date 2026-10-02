# Knowlix Encyclopedia — Production Deployment Guide for Vercel

This guide provides step-by-step instructions for deploying the **Knowlix Open Encyclopedia** to [Vercel](https://vercel.com) using a hosted PostgreSQL database (such as Neon, Supabase, AWS RDS, or Railway).

---

## 1. Prerequisites

Before deploying, ensure you have:
1. A **GitHub**, **GitLab**, or **Bitbucket** account with this repository pushed.
2. A **Vercel** account ([vercel.com](https://vercel.com)).
3. A hosted **PostgreSQL** database instance (recommended: [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com)).
4. (Optional) S3-compatible cloud storage (AWS S3, Cloudflare R2, or Wasabi) for user-uploaded media.

---

## 2. Provisioning the PostgreSQL Database

### Using Neon (Recommended for Serverless)
1. Create a project at [Neon.tech](https://neon.tech).
2. Create a database named `knowlix`.
3. In the Neon Dashboard, copy both:
   - **Pooled connection string** (with `?pgbouncer=true` or `-pooler` endpoint) -> Set as `DATABASE_URL`.
   - **Direct connection string** (non-pooled) -> Set as `DIRECT_URL`.

### Using Supabase
1. Create a project at [Supabase.com](https://supabase.com).
2. In Project Settings > Database, copy the **Transaction Connection Pooler string** (Port 6543) for `DATABASE_URL` and the **Session Direct string** (Port 5432) for `DIRECT_URL`.

---

## 3. Initializing Database Schema & Migrations

From your local machine or CI pipeline, push the Prisma schema to your hosted PostgreSQL instance:

```bash
# Push schema directly to hosted PostgreSQL
DATABASE_URL="your-hosted-postgres-connection-string" npx prisma db push

# Seed initial 18 policies, categories, and scholarly demo accounts
DATABASE_URL="your-hosted-postgres-connection-string" npm run db:seed
```

---

## 4. Connecting the Git Repository to Vercel

1. Log in to the [Vercel Dashboard](https://vercel.com).
2. Click **"Add New..."** > **"Project"**.
3. Import your `Knowlix` repository.
4. Under **Framework Preset**, select **Next.js**.
5. Keep **Root Directory** as `./`.

---

## 5. Configuring Vercel Environment Variables

In the Vercel project configuration screen (under **Settings > Environment Variables**), add the following:

| Variable Name | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Pooled PostgreSQL connection string | `postgresql://user:pass@ep-pooler.neon.tech/knowlix?sslmode=require` |
| `DIRECT_URL` | Direct PostgreSQL connection string | `postgresql://user:pass@ep-direct.neon.tech/knowlix?sslmode=require` |
| `AUTH_SECRET` | 32+ character random encryption secret | `generate-random-32-character-secret-key-here` |
| `NEXT_PUBLIC_APP_URL` | Production canonical URL | `https://knowlix.org` (or `https://your-app.vercel.app`) |
| `STORAGE_PROVIDER` | Media storage provider | `s3`, `vercel-blob`, or `local` |
| `STORAGE_ENDPOINT` | S3 / R2 API endpoint | `https://<account_id>.r2.cloudflarestorage.com` |
| `STORAGE_ACCESS_KEY` | Storage Access Key | `your-s3-access-key` |
| `STORAGE_SECRET_KEY` | Storage Secret Key | `your-s3-secret-key` |
| `STORAGE_BUCKET` | Storage Bucket Name | `knowlix-media` |
| `STORAGE_PUBLIC_URL` | Public CDN URL for images | `https://media.knowlix.org` |
| `NODE_ENV` | Production environment | `production` |

---

## 6. Build Settings & Verification

Vercel automatically detects Next.js build commands:

- **Build Command**: `prisma generate && next build` (defined in `package.json`)
- **Output Directory**: `.next`
- **Install Command**: `npm install`

Click **Deploy**. Vercel will build the application, generate Prisma Client types, bundle serverless routes, and deploy globally.

---

## 7. Configuring Custom Production Domain

1. In the Vercel Dashboard, go to **Settings > Domains**.
2. Add your custom domain (e.g. `knowlix.org` or `wiki.yourdomain.com`).
3. Configure DNS records:
   - For apex domain (`knowlix.org`): A record pointing to `76.76.21.21`
   - For subdomain (`wiki.yourdomain.com`): CNAME record pointing to `cname.vercel-dns.com`
4. Update `NEXT_PUBLIC_APP_URL` in Vercel Environment Variables to match your custom domain.

---

## 8. Verifying First Production Deployment

1. Visit your deployed URL (e.g., `https://your-project.vercel.app`).
2. Verify the homepage loads scholarly articles and categories.
3. Perform a search query (e.g., "Quantum" or "Silk Road").
4. Log in using a demo scholar account:
   - **Username**: `dr_elena_vance`
   - **Password**: `Knowlix2026!`
5. Test creating a new stub entry and editing an existing article to verify revision provenance tracking.
6. Verify `/sitemap.xml` and `/robots.txt` respond correctly.

---

## 9. Troubleshooting Common Deployment Issues

### Database Connection Exhaustion (Serverless)
- **Symptom**: `PrismaClientInitializationError: Can't reach database server at ...`
- **Fix**: Ensure your `DATABASE_URL` uses Neon's connection pooler URL or Supabase's transaction pooler (Port 6543) rather than direct port 5432.

### Prisma Client Generation on Vercel Build
- **Symptom**: `Cannot find module '@prisma/client'`
- **Fix**: Verify `package.json` build script is `"prisma generate && next build"`.

### Next.js Image Optimization
- **Symptom**: External avatar or media images not rendering.
- **Fix**: Add allowed remote hostnames under `images.remotePatterns` in `next.config.ts`.
