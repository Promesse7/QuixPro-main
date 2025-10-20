# Vercel Deployment Guide - Fix for Relative URL Issues

## Problem Fixed
This update resolves the Vercel deployment error:
```
Failed to parse URL from /api/levels
```

The issue was caused by relative fetch URLs (`/api/levels`) being used during the build process, where there's no running server to resolve them.

## Changes Made

### 1. Updated Files
All fetch calls have been updated to use absolute URLs via the `getBaseUrl()` utility:

- ✅ `app/auth/page.tsx` - Fixed auth and levels fetch
- ✅ `app/stories/page.tsx` - Fixed stories fetch
- ✅ `app/certificates/page.tsx` - Fixed certificates fetch
- ✅ `app/certificates/[id]/page.tsx` - Fixed single certificate fetch
- ✅ `app/quiz-selection/page.tsx` - Fixed levels, courses, units, and quiz fetch
- ✅ `app/quiz/[id]/page.tsx` - Fixed quiz and attempts fetch
- ✅ `components/dashboard/leaderboard.tsx` - Fixed leaderboard fetch

### 2. How It Works
The `getBaseUrl()` function (in `lib/getBaseUrl.ts`) automatically determines the correct base URL:

```typescript
export function getBaseUrl(): string {
  // 1. Use explicit public base URL if set
  if (process?.env?.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  
  // 2. Use Vercel's auto-generated URL during build/runtime
  if (process?.env?.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  
  // 3. Fallback to localhost for local development
  return 'http://localhost:3000';
}
```

## Deployment Instructions

### Step 1: Local Testing
1. The `.env.local` file has been created with:
   ```
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```
2. Test locally to ensure everything works:
   ```bash
   npm run dev
   ```

### Step 2: Configure Vercel Environment Variables
1. Go to your Vercel Dashboard
2. Select your project (QuixPro-main)
3. Navigate to **Settings** → **Environment Variables**
4. Add the following variable:
   - **Key**: `NEXT_PUBLIC_BASE_URL`
   - **Value**: `https://your-project-name.vercel.app` (replace with your actual Vercel URL)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**

### Step 3: Deploy to Vercel
After pushing these changes to GitHub, Vercel will automatically:
1. Detect the new commit
2. Start a new deployment
3. Use the environment variable during build
4. Successfully complete the deployment

### Step 4: Verify Deployment
1. Check the Vercel deployment logs for success
2. Visit your deployed site
3. Test the following pages:
   - `/auth` - Login/signup page
   - `/stories` - Stories listing
   - `/certificates` - Certificates page
   - `/quiz-selection` - Quiz selection
   - Any quiz page

## Alternative: Let Vercel Auto-Detect
If you don't want to manually set the environment variable, the code will automatically use Vercel's `VERCEL_URL` environment variable, which is automatically provided during build and runtime.

## Troubleshooting

### If deployment still fails:
1. Check Vercel logs for specific error messages
2. Verify environment variables are set correctly
3. Ensure all fetch calls use `getBaseUrl()` prefix
4. Clear Vercel cache and redeploy

### If pages don't load data:
1. Check browser console for fetch errors
2. Verify API routes are working
3. Check MongoDB connection if using database
4. Ensure CORS settings allow your domain

## Notes
- The `.env.local` file is for local development only and is not committed to Git
- Vercel automatically provides `VERCEL_URL` during deployment
- Setting `NEXT_PUBLIC_BASE_URL` explicitly gives you more control over the URL used