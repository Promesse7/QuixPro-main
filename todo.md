# Fix Vercel Deployment - Relative URL Issues

## 1. Analysis Phase
- [x] Clone repository
- [x] Identify all files with relative fetch URLs
- [x] Verify getBaseUrl utility exists

## 2. Fix Files with Relative Fetch URLs
- [x] Fix app/auth/page.tsx (already has getBaseUrl import but broken implementation)
- [x] Fix app/stories/page.tsx
- [x] Fix app/certificates/page.tsx
- [x] Fix app/certificates/[id]/page.tsx
- [x] Fix app/quiz-selection/page.tsx
- [x] Fix app/quiz/[id]/page.tsx
- [x] Fix components/dashboard/leaderboard.tsx

## 3. Environment Configuration
- [x] Create/update .env.local with NEXT_PUBLIC_BASE_URL
- [x] Document Vercel environment variable setup

## 4. Testing & Deployment
- [ ] Commit changes to new branch
- [ ] Push branch to GitHub
- [ ] Create pull request
- [ ] Provide deployment instructions