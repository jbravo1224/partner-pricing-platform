#!/bin/bash

echo "🚀 Setting up Partner Pricing Platform Database..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   - Download from: https://nodejs.org/"
    echo "   - Or use Homebrew: brew install node"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🗄️ Pushing database schema..."
npx prisma db push

echo "🌱 Seeding database with example data..."
node setup-database.js

echo ""
echo "✅ Setup complete!"
echo ""
echo "🔗 Your application should now work:"
echo "   - Admin panel: /admin (password: admin123)"
echo "   - ACME calculator: /p/acme"
echo "   - Blue Rocket calculator: /p/blue-rocket"
echo ""
echo "🚀 Start your development server:"
echo "   npm run dev"
