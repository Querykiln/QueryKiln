#!/bin/bash

echo "🔧 Creating clean ZIP for ChatGPT…"

# Go to the directory where this script is located
cd "$(dirname "$0")"

# Remove any previous export
rm -rf chatgpt-export
rm -f seo-chatgpt.zip

# Create clean directory
mkdir chatgpt-export

# Copy only SAFE folders
cp -R src chatgpt-export/src
cp -R electron chatgpt-export/electron

# Copy safe standalone files
cp package.json chatgpt-export/package.json
cp vite.config.js chatgpt-export/vite.config.js 2>/dev/null || true
cp tailwind.config.js chatgpt-export/tailwind.config.js 2>/dev/null || true
cp postcss.config.js chatgpt-export/postcss.config.js 2>/dev/null || true
cp eslint.config.js chatgpt-export/eslint.config.js 2>/dev/null || true
cp README.md chatgpt-export/README.md 2>/dev/null || true
cp LICENSE chatgpt-export/LICENSE 2>/dev/null || true

# 🚫 DO NOT COPY THESE FOLDERS
rm -rf chatgpt-export/node_modules
rm -rf chatgpt-export/dist
rm -rf chatgpt-export/build
rm -rf chatgpt-export/release
rm -rf chatgpt-export/.git
rm -rf chatgpt-export/.next
rm -rf chatgpt-export/.cache
rm -rf chatgpt-export/.vite
rm -rf chatgpt-export/.turbo

# Make the ZIP
zip -r seo-chatgpt.zip chatgpt-export > /dev/null

echo "✅ Done!"
echo "📦 Created seo-chatgpt.zip"
echo "⬆️ Upload seo-chatgpt.zip to ChatGPT"
