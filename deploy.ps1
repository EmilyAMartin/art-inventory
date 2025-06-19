Set-Location ./frontend
npm run build

Copy-Item -Recurse -Force ./dist ../backend/dist

Set-Location ../backend
fly deploy
