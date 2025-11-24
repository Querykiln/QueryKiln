#!/bin/bash

echo "🔄 Performing a FULL clean reinstall of your project…"

# Go to script directory
cd "$(dirname "$0")"

echo "🧹 Removing old generated folders…"
rm -rf node_modules
rm -rf dist
rm -rf build
rm -rf release
rm -rf .vite
rm -rf .cache
rm -rf .turbo
rm -rf package-lock.json

echo "📦 Reinstalling dependencies from package.json…"
npm install

echo "🔧 Rebuilding Vite client…"
npm run build

echo "⚡ Rebuilding Electron…"
npm run desktop-dev &>/dev/null

echo "🎉 Done!"
echo ""
echo "Your environment is now clean and rebuilt."
echo "Run with: npm run desktop-dev"
