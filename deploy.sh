#!/bin/bash

# Partner Pricing Platform Deployment Script
# This script helps you deploy to various platforms

set -e

echo "🚀 Partner Pricing Platform Deployment Helper"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Function to deploy to Vercel
deploy_vercel() {
    echo "📦 Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Login to Vercel
    vercel login
    
    # Deploy
    vercel --prod
    
    echo "✅ Deployed to Vercel!"
    echo "🔗 Your app should be available at the URL shown above"
}

# Function to deploy to Railway
deploy_railway() {
    echo "🚂 Deploying to Railway..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        echo "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # Login to Railway
    railway login
    
    # Deploy
    railway up
    
    echo "✅ Deployed to Railway!"
    echo "🔗 Your app should be available at the URL shown above"
}

# Function to build Docker image
build_docker() {
    echo "🐳 Building Docker image..."
    
    # Build the image
    docker build -t partner-pricing-platform .
    
    echo "✅ Docker image built successfully!"
    echo "🚀 To run locally: docker run -p 3000:3000 partner-pricing-platform"
}

# Function to run with Docker Compose
run_docker_compose() {
    echo "🐳 Starting with Docker Compose..."
    
    # Start services
    docker-compose up -d
    
    echo "✅ Services started!"
    echo "🔗 App available at: http://localhost:3000"
    echo "🗄️  Database available at: localhost:5432"
}

# Function to setup environment
setup_env() {
    echo "⚙️  Setting up environment..."
    
    if [ ! -f ".env.local" ]; then
        cp env.example .env.local
        echo "📝 Created .env.local from template"
        echo "⚠️  Please edit .env.local with your actual values"
    else
        echo "✅ .env.local already exists"
    fi
}

# Function to setup database
setup_database() {
    echo "🗄️  Setting up database..."
    
    # Generate Prisma client
    npx prisma generate
    
    # Push schema
    npx prisma db push
    
    # Seed data
    npx prisma db seed
    
    echo "✅ Database setup complete!"
}

# Main menu
echo ""
echo "Choose your deployment option:"
echo "1) Deploy to Vercel (Recommended)"
echo "2) Deploy to Railway"
echo "3) Build Docker image"
echo "4) Run with Docker Compose"
echo "5) Setup environment only"
echo "6) Setup database only"
echo "7) Full local setup"
echo ""

read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        deploy_vercel
        ;;
    2)
        deploy_railway
        ;;
    3)
        build_docker
        ;;
    4)
        run_docker_compose
        ;;
    5)
        setup_env
        ;;
    6)
        setup_database
        ;;
    7)
        setup_env
        setup_database
        echo "✅ Full local setup complete!"
        echo "🚀 Run 'npm run dev' to start the development server"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📚 For more information, see:"
echo "   - README.md for setup instructions"
echo "   - DEPLOYMENT.md for detailed deployment guide"
echo "   - PROJECT_SUMMARY.md for feature overview"
