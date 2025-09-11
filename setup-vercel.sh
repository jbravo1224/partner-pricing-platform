#!/bin/bash

echo "🚀 Setting up Partner Pricing Platform for Vercel..."

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
fi

# Login to Vercel
echo "🔐 Logging into Vercel..."
vercel login

# Link project
echo "🔗 Linking project..."
vercel link

# Pull environment variables
echo "📥 Pulling environment variables..."
vercel env pull .env.local

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️ Setting up database schema..."
npx prisma db push

# Seed database
echo "🌱 Seeding database with example data..."
npx prisma db seed

echo "✅ Setup complete! Your app should now work on Vercel."
echo "🔗 Admin panel: https://your-app.vercel.app/admin (password: admin123)"
echo "🧮 Calculators: https://your-app.vercel.app/p/acme and https://your-app.vercel.app/p/blue-rocket"
