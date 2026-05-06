# Complete Step-by-Step Railway Deployment Guide for Samachar Hub

## Phase 1: Create Railway Account

### Step 1.1: Open Railway Website
1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Type this exact URL in the address bar: `https://railway.app`
3. Press Enter to go to the website
4. Wait for the page to load completely

### Step 1.2: Start Sign Up Process
1. Look for the "Sign Up" or "Get Started" button on the homepage
2. Click on it
3. You will see multiple sign-up options

### Step 1.3: Choose GitHub Sign Up (Recommended)
1. Click on the "Continue with GitHub" button
2. If you're not logged into GitHub, a new window/tab will open
3. Sign in to your GitHub account:
   - Enter your GitHub username or email
   - Enter your GitHub password
   - Click "Sign in"
4. If you have 2-factor authentication enabled, enter the code from your authenticator app or SMS

### Step 1.4: Authorize Railway
1. GitHub will ask if you want to authorize Railway to access your account
2. Click "Authorize Railway" or "Authorize GitHub"
3. This gives Railway permission to deploy your code

### Step 1.5: Complete Account Setup
1. Railway will redirect you back to their site
2. You might be asked to verify your email:
   - Check your email inbox
   - Look for an email from Railway
   - Click the verification link
3. Fill in any additional profile information if requested
4. Your Railway account is now created!

### Step 1.6: Verify Account Creation
1. You should now see the Railway dashboard
2. Look for "Projects" or "New Project" button
3. If you see this, your account is ready

## Phase 2: Set Up Database

### Step 2.1: Create New Project
1. In your Railway dashboard, click "New Project"
2. You will see different options

### Step 2.2: Choose Database Option
1. Look for "Provision MySQL" or "Database" section
2. Click on "MySQL" or "Provision MySQL"
3. Wait for the database creation to start

### Step 2.3: Configure Database
1. Give your database a name: `samachar-db`
2. Choose the free plan (it should be selected by default)
3. Click "Provision MySQL" or "Create Database"
4. Wait for the database to be created (this takes 2-3 minutes)
5. You will see a success message when it's ready

### Step 2.4: Get Database Connection Details
1. In your project dashboard, click on your MySQL database
2. Look for the "Connect" tab or section
3. Click on "Connection URL" or "Connect"
4. Copy the full DATABASE_URL - it looks like: `mysql://username:password@host:port/database`
5. Save this URL somewhere safe (you'll need it later)

## Phase 3: Deploy Your Application

### Step 3.1: Start New Project for App
1. Go back to your Railway dashboard
2. Click "New Project" again
3. This time choose "Deploy from GitHub repo"

### Step 3.2: Connect GitHub Repository
1. If not already connected, click "Connect GitHub"
2. Authorize Railway to access your repositories
3. You should see a list of your GitHub repositories

### Step 3.3: Select Your Repository
1. Find and click on `samachar-hub` repository
2. If you don't see it, make sure it's public or you have access
3. Click "Deploy" or "Deploy from GitHub"

### Step 3.4: Wait for Initial Deployment
1. Railway will start building your app
2. This takes several minutes
3. You can watch the progress in the "Deployments" tab
4. Wait until you see "Success" or "Deployed"

## Phase 4: Configure Environment Variables

### Step 4.1: Access Project Settings
1. In your project dashboard, click on your app (not the database)
2. Look for "Variables" tab or "Environment" section
3. Click on it

### Step 4.2: Add Required Variables
Add these variables one by one. Click "Add Variable" after each one:

1. **DATABASE_URL**
   - Name: `DATABASE_URL`
   - Value: Paste the MySQL connection URL you copied earlier
   - Click "Add"

2. **JWT_SECRET**
   - Name: `JWT_SECRET`
   - Value: Create a secure secret like: `your-super-secret-jwt-key-change-this-123456`
   - Click "Add"

3. **VITE_APP_ID**
   - Name: `VITE_APP_ID`
   - Value: Your Manus app ID (get from Manus dashboard)
   - Click "Add"

4. **OAUTH_SERVER_URL**
   - Name: `OAUTH_SERVER_URL`
   - Value: `https://api.manus.app`
   - Click "Add"

5. **VITE_OAUTH_PORTAL_URL**
   - Name: `VITE_OAUTH_PORTAL_URL`
   - Value: `https://app.manus.app`
   - Click "Add"

6. **OWNER_OPEN_ID**
   - Name: `OWNER_OPEN_ID`
   - Value: Your Manus OpenID (get from Manus dashboard)
   - Click "Add"

7. **DEV_ADMIN_NAME**
   - Name: `DEV_ADMIN_NAME`
   - Value: `Your Name` (replace with your actual name)
   - Click "Add"

8. **DEV_ADMIN_EMAIL**
   - Name: `DEV_ADMIN_EMAIL`
   - Value: `your.email@example.com` (replace with your email)
   - Click "Add"

9. **DEV_ADMIN_OPEN_ID**
   - Name: `DEV_ADMIN_OPEN_ID`
   - Value: `admin-user-123` (create a unique ID)
   - Click "Add"

10. **NODE_ENV**
    - Name: `NODE_ENV`
    - Value: `production`
    - Click "Add"

### Step 4.3: Verify Variables
1. Check that all variables are listed correctly
2. Make sure there are no typos in the names
3. If you made a mistake, click the edit icon next to any variable

### Step 4.4: Redeploy with Variables
1. Go to "Deployments" tab
2. Click "Redeploy" or "Trigger Redeploy"
3. Wait for the new deployment to complete
4. Your app should now work with the database

## Phase 5: Set Up Domain (Optional)

### Step 5.1: Access Domain Settings
1. In your project, click "Settings" tab
2. Look for "Domains" section
3. Click on it

### Step 5.2: Use Railway Domain
1. Railway provides a free domain automatically
2. It looks like: `your-project-name.up.railway.app`
3. Copy this domain - you'll need it later
4. You can use this free domain for now

### Step 5.3: Add Custom Domain (Optional)
1. If you want a custom domain:
   - Buy a domain from Namecheap.com or GoDaddy.com (~$10/year)
   - In Railway, click "Add Domain"
   - Enter your custom domain name
   - Follow Railway's DNS instructions

## Phase 6: Test Your Live Site

### Step 6.1: Access Your Site
1. Go to your Railway domain: `https://your-project-name.up.railway.app`
2. Your homepage should load
3. Try navigating to different pages

### Step 6.2: Test Admin Login
1. Go to: `https://your-project-name.up.railway.app/login`
2. Enter the admin credentials you set in environment variables
3. Click login
4. You should be redirected to admin panel

### Step 6.3: Test News Publishing
1. In admin panel, try creating a news article
2. Check if it appears on the homepage
3. Test search and other features

## Phase 7: Update SEO Files

### Step 7.1: Run Update Script
1. On your computer, open the `samachar-hub` folder
2. Double-click `update-seo.bat` file
3. When prompted, enter your Railway domain (e.g., `https://your-project.up.railway.app`)
4. Press Enter

### Step 7.2: Rebuild and Deploy
1. Open command prompt or PowerShell in your project folder
2. Run: `pnpm build`
3. Wait for build to complete
4. Commit and push changes to GitHub:
   ```
   git add .
   git commit -m "Update SEO files with live domain"
   git push
   ```
5. Railway will automatically redeploy

## Phase 8: Make it Discoverable on Google

### Step 8.1: Create Google Search Console Account
1. Go to: `https://search.google.com/search-console`
2. Sign in with your Google account
3. Click "Add Property"

### Step 8.2: Add Your Domain
1. Choose "URL prefix" method
2. Enter your Railway domain: `https://your-project-name.up.railway.app`
3. Click "Continue"

### Step 8.3: Verify Ownership
1. Choose "HTML file" verification method
2. Download the verification file
3. In Railway project, go to "Settings" → "Public Files"
4. Upload the verification file
5. Click "Verify" in Google Search Console

### Step 8.4: Submit Sitemap
1. In Google Search Console, go to "Sitemaps"
2. Enter: `sitemap.xml`
3. Click "Submit"
4. Google will start indexing your site

## Phase 9: Share with Friends

### Step 9.1: Test Everything Works
1. Visit your site one more time
2. Test login, news creation, search
3. Make sure everything is working

### Step 9.2: Share the Link
1. Copy your Railway domain
2. Send to your friends via WhatsApp, email, or social media
3. Tell them they can access the admin panel at: `your-domain.com/login`

## Troubleshooting

### If Deployment Fails:
1. Check Railway deployment logs
2. Make sure all environment variables are correct
3. Verify DATABASE_URL format

### If Database Connection Fails:
1. Check if MySQL database is running
2. Verify DATABASE_URL is correct
3. Make sure database and app are in same Railway project

### If Login Doesn't Work:
1. Check DEV_ADMIN_* environment variables
2. Make sure JWT_SECRET is set
3. Check Railway logs for errors

### If Site Doesn't Load:
1. Wait 5-10 minutes after deployment
2. Check if build succeeded
3. Verify domain is correct

## Cost Summary
- Railway App: Free (512MB RAM, 1GB disk)
- MySQL Database: Free
- Custom Domain: ~$10/year (optional)
- Total: Free to start!

Your news website is now live and ready for your friends!</content>
<parameter name="filePath">c:\Users\Bishnu\Downloads\samachar-hub\DEPLOYMENT.md