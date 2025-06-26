Set-Location ./frontend
npm run build

Remove-Item ../backend/dist -Recurse -Force
Copy-Item -Recurse -Force ./dist ../backend/dist

Set-Location ../backend
fly deploy