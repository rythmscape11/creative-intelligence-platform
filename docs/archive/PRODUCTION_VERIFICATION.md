# Production Deployment Verification

Use these steps to confirm that the latest changes from `main` are live on the production deployment (`www.mediaplanpro.com`, Vercel alias).

## 1) Confirm `main` has the expected commit
1. Pull the latest changes locally: `git fetch origin && git checkout main && git pull`.
2. Check the commit hash you expect to see in production: `git rev-parse --short HEAD`.

## 2) Check Vercel deployment history
1. Ensure you are logged in: `vercel whoami`.
2. List the most recent deployments for the production project: `vercel ls mediaplanpro --prod --limit 5`.
3. Find the deployment whose Git SHA matches the hash from step 1. This confirms Vercel built the correct commit.

## 3) Inspect the active production alias
1. Inspect the production deployment to confirm which URL is aliased: `vercel inspect mediaplanpro --prod`.
2. Verify the `alias` entry includes `www.mediaplanpro.com` (and `mediaplanpro.vercel.app` as the fallback) and points to the deployment from step 2.

## 4) Validate the live site is serving the expected build
1. Fetch the site headers and note the deployment identifier: `curl -I https://www.mediaplanpro.com`.
2. Look for the `x-vercel-id` and `x-vercel-deployment-url` headers; the deployment URL should match the one from step 2.
3. Optionally force a fresh response to avoid caching: `curl -I -H "Cache-Control: no-cache" https://www.mediaplanpro.com`.

## 5) Spot-check functionality
1. Open the production site and validate critical flows (e.g., sign-in/sign-out, dashboard loading).
2. If you added logging around session retrieval, verify the expected log entries in your monitoring tool for a production request.

## 6) When things don't match
- If the latest commit is missing from `vercel ls`, trigger a new deployment (via a fresh push to `main` or `vercel --prod`).
- If the alias points to an older deployment, re-alias the correct one: `vercel alias set <deployment-url> mediaplanpro.vercel.app`.
- If caches look stale, redeploy or purge CDN caches by redeploying the current commit.
