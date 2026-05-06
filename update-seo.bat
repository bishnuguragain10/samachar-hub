@echo off
echo Updating SEO files with your domain...
set /p DOMAIN="Enter your live domain (e.g., https://your-project.up.railway.app): "

powershell -Command "(Get-Content client\public\sitemap.xml) -replace 'https://your-domain.com', '%DOMAIN%' | Set-Content client\public\sitemap.xml"
powershell -Command "(Get-Content client\public\robots.txt) -replace 'https://your-domain.com', '%DOMAIN%' | Set-Content client\public\robots.txt"

echo SEO files updated! Rebuild and redeploy your app.
echo.
echo Next steps:
echo 1. Run: pnpm build
echo 2. Commit and push changes to GitHub
echo 3. Your hosting service will auto-deploy
pause