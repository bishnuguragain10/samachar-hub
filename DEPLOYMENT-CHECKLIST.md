# Railway Deployment Checklist

## Phase 1: Create Railway Account ✅
- [ ] Opened railway.app website
- [ ] Clicked Sign Up/Get Started
- [ ] Chose GitHub sign up
- [ ] Signed into GitHub account
- [ ] Authorized Railway access
- [ ] Verified email (if required)
- [ ] Saw Railway dashboard

## Phase 2: Set Up Database ✅
- [ ] Clicked "New Project"
- [ ] Chose "Provision MySQL"
- [ ] Named database "samachar-db"
- [ ] Waited for database creation (2-3 minutes)
- [ ] Copied DATABASE_URL from Connect tab

## Phase 3: Deploy Application ✅
- [ ] Clicked "New Project" again
- [ ] Chose "Deploy from GitHub repo"
- [ ] Connected GitHub account
- [ ] Selected "samachar-hub" repository
- [ ] Clicked Deploy
- [ ] Waited for initial deployment

## Phase 4: Configure Environment Variables ✅
- [ ] Clicked on app project (not database)
- [ ] Went to Variables tab
- [ ] Added DATABASE_URL variable
- [ ] Added JWT_SECRET variable
- [ ] Added VITE_APP_ID variable
- [ ] Added OAUTH_SERVER_URL variable
- [ ] Added VITE_OAUTH_PORTAL_URL variable
- [ ] Added OWNER_OPEN_ID variable
- [ ] Added DEV_ADMIN_NAME variable
- [ ] Added DEV_ADMIN_EMAIL variable
- [ ] Added DEV_ADMIN_OPEN_ID variable
- [ ] Added NODE_ENV variable
- [ ] Triggered redeploy

## Phase 5: Set Up Domain ✅
- [ ] Went to Settings → Domains
- [ ] Copied Railway domain (your-project-name.up.railway.app)
- [ ] (Optional) Added custom domain

## Phase 6: Test Live Site ✅
- [ ] Visited Railway domain
- [ ] Homepage loaded
- [ ] Tested navigation
- [ ] Tested admin login (/login)
- [ ] Tested news publishing
- [ ] Tested search functionality

## Phase 7: Update SEO Files ✅
- [ ] Ran update-seo.bat script
- [ ] Entered Railway domain when prompted
- [ ] Ran pnpm build
- [ ] Committed and pushed changes to GitHub
- [ ] Waited for Railway auto-redeploy

## Phase 8: Google Search Console ✅
- [ ] Created Google Search Console account
- [ ] Added property with Railway domain
- [ ] Downloaded verification file
- [ ] Uploaded verification file to Railway
- [ ] Verified ownership in Google
- [ ] Submitted sitemap.xml

## Phase 9: Share with Friends ✅
- [ ] Final testing of all features
- [ ] Shared Railway domain URL
- [ ] Told friends about admin access

## Notes:
- Your Railway domain: __________________________
- DATABASE_URL: __________________________
- Admin login credentials: __________________________

## Troubleshooting Checklist:
- [ ] Check Railway deployment logs if issues occur
- [ ] Verify all environment variables are correct
- [ ] Ensure DATABASE_URL format is correct
- [ ] Test database connection in Railway dashboard
- [ ] Check that app and database are in same project