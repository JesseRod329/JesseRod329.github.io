# Database Setup Guide

This app uses PostgreSQL for production (Vercel Postgres) and can work with SQLite locally.

## Production Setup (Vercel)

### Step 1: Create Vercel Postgres Database

1. Go to your Vercel project: https://vercel.com/jesserod329s-projects/politician-tracker/stores
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Accept the defaults and click **"Create"**

Vercel will automatically add these environment variables:
- `POSTGRES_PRISMA_URL` - Connection pool URL (used by Prisma)
- `POSTGRES_URL_NON_POOLING` - Direct connection URL (for migrations)
- `POSTGRES_URL` - Standard connection URL

### Step 2: Deploy

The app will automatically:
- Map `POSTGRES_PRISMA_URL` → `DATABASE_URL` 
- Map `POSTGRES_URL_NON_POOLING` → `DIRECT_URL`
- Run Prisma migrations during build
- Seed initial data if needed

Just push to your main branch or redeploy from the Vercel dashboard.

## Local Development

### Option 1: Use SQLite (Simplest)

No setup needed! The app will use a local SQLite file at `prisma/dev.db` if no `DATABASE_URL` is set.

### Option 2: Use Local Postgres

1. Install PostgreSQL locally
2. Create a database:
   ```bash
   createdb politician_tracker_dev
   ```
3. Set environment variable:
   ```bash
   export DATABASE_URL="postgresql://user:password@localhost:5432/politician_tracker_dev"
   export DIRECT_URL="postgresql://user:password@localhost:5432/politician_tracker_dev"
   ```
4. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

## Verify Setup

After deployment, check:
- ✅ State selection on the map works
- ✅ No "Internal Server Error" messages
- ✅ Data loads correctly

If you see errors, check:
1. Vercel environment variables are set (Settings → Environment Variables)
2. Build logs show successful Prisma migration
3. Database is accessible from Vercel

