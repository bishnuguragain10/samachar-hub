# Environment Variables Reference

## Required Variables for Railway Deployment

Copy and paste these into Railway's Variables section. Replace the placeholder values with your actual information.

### Database Connection

```
DATABASE_URL = mysql://username:password@host:port/database
```

**How to get this:** In Railway dashboard → Your MySQL database → Connect tab → Copy the full Connection URL

### Authentication & Security

```
JWT_SECRET = your-super-secret-jwt-key-change-this-123456
```

**What to put:** Make up a long, random string. Keep it secret and don't share it.

### Manus App Integration

```
VITE_APP_ID = your-manus-app-id-here
OAUTH_SERVER_URL = https://api.manus.app
VITE_OAUTH_PORTAL_URL = https://app.manus.app
OWNER_OPEN_ID = your-manus-open-id-here
```

**Where to get these:** Log into your Manus account → App settings → Copy the App ID and OpenID

### Admin Login (Development Mode)

```
DEV_ADMIN_NAME = Your Full Name
DEV_ADMIN_EMAIL = your.email@example.com
DEV_ADMIN_OPEN_ID = admin-user-123
```

**What to put:**

- DEV_ADMIN_NAME: Your actual name (e.g., "John Doe")
- DEV_ADMIN_EMAIL: Your email address
- DEV_ADMIN_OPEN_ID: Any unique identifier (e.g., "admin-123" or "my-admin-user")

### Production Settings

```
NODE_ENV = production
```

**What to put:** Keep this exactly as "production"

## How to Add Variables in Railway:

1. Go to your Railway project dashboard
2. Click on your app (not the database)
3. Click "Variables" tab
4. Click "Add Variable" for each one
5. Enter the name exactly as shown above (case-sensitive)
6. Enter your value
7. Click "Add"
8. After adding all variables, go to "Deployments" tab
9. Click "Redeploy" to apply the changes

## Verification:

After deployment, test your admin login at:
`https://your-project-name.up.railway.app/login`

Use the DEV_ADMIN_EMAIL and DEV_ADMIN_NAME you set above.

## Troubleshooting:

If login doesn't work:

- Check that DEV_ADMIN_EMAIL matches exactly what you enter on login page
- Verify JWT_SECRET is set and not empty
- Check Railway deployment logs for errors

If database connection fails:

- Verify DATABASE_URL format starts with "mysql://"
- Make sure the database and app are in the same Railway project
- Check that MySQL database is running (green status)
