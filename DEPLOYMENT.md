# Deployment Guide - Partner Pricing Platform

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is perfect for Next.js applications and offers:
- Automatic deployments from GitHub
- Built-in PostgreSQL database (Vercel Postgres)
- Environment variable management
- Custom domains
- Free tier available

#### Steps:
1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/partner-pricing-platform.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**:
   In Vercel dashboard → Project Settings → Environment Variables:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   ADMIN_PASSWORD=your-secure-password
   EMAIL_PROVIDER=postmark
   EMAIL_FROM=noreply@yourdomain.com
   POSTMARK_KEY=your-postmark-key
   ```

4. **Set up Database**:
   - Add Vercel Postgres addon
   - Run migrations: `npx prisma db push`
   - Seed data: `npx prisma db seed`

### Option 2: Railway

Railway offers:
- Simple deployment from GitHub
- Built-in PostgreSQL
- Automatic HTTPS
- $5/month for hobby plan

#### Steps:
1. **Connect GitHub**:
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"

2. **Add Database**:
   - Click "New" → "Database" → "PostgreSQL"
   - Copy the DATABASE_URL from the database service

3. **Configure Environment Variables**:
   In Railway dashboard → Variables tab:
   ```
   DATABASE_URL=postgresql://...
   ADMIN_PASSWORD=your-secure-password
   EMAIL_PROVIDER=postmark
   EMAIL_FROM=noreply@yourdomain.com
   POSTMARK_KEY=your-postmark-key
   ```

4. **Deploy**:
   - Railway will automatically build and deploy
   - Run migrations in Railway console

### Option 3: DigitalOcean App Platform

#### Steps:
1. **Prepare Repository**:
   - Push code to GitHub
   - Create `app.yaml` in root directory

2. **Create App**:
   - Go to DigitalOcean App Platform
   - Create new app from GitHub
   - Select your repository

3. **Configure**:
   - Add PostgreSQL database component
   - Set environment variables
   - Deploy

### Option 4: AWS/GCP/Azure

For enterprise deployments, you can use:
- **AWS**: ECS + RDS + CloudFront
- **GCP**: Cloud Run + Cloud SQL + Cloud CDN
- **Azure**: Container Instances + Azure Database + CDN

## 🔧 Pre-Deployment Checklist

### 1. Environment Variables
Create a `.env.production` file with:
```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Admin Authentication
ADMIN_PASSWORD="your-very-secure-password-here"

# Email Configuration
EMAIL_PROVIDER="postmark"  # or "smtp"
EMAIL_FROM="noreply@yourdomain.com"

# Postmark (if using Postmark)
POSTMARK_KEY="your-postmark-api-key"

# SMTP (if using SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 2. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to production database
npm run db:push

# Seed with example data
npm run db:seed
```

### 3. Build Test
```bash
# Test production build locally
npm run build
npm start
```

## 📧 Email Provider Setup

### Postmark (Recommended)
1. Sign up at [postmarkapp.com](https://postmarkapp.com)
2. Create a new server
3. Get your API key
4. Set up sender signature
5. Add to environment variables

### SMTP Alternative
1. Use Gmail with App Password
2. Or use SendGrid, Mailgun, etc.
3. Configure SMTP settings

## 🔒 Security Checklist

- [ ] Strong ADMIN_PASSWORD (use password generator)
- [ ] HTTPS enabled (automatic on most platforms)
- [ ] Database credentials secured
- [ ] Email API keys protected
- [ ] Environment variables not in code
- [ ] Regular backups configured

## 🌐 Custom Domain Setup

### Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Railway:
1. Go to Settings → Domains
2. Add custom domain
3. Configure DNS

## 📊 Monitoring & Maintenance

### Recommended Tools:
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Bugsnag
- **Analytics**: Google Analytics, Vercel Analytics
- **Logs**: Platform-specific logging

### Regular Tasks:
- Monitor database performance
- Check email delivery rates
- Review admin access logs
- Update dependencies monthly
- Backup database weekly

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Failed**:
   - Check DATABASE_URL format
   - Verify database is running
   - Check firewall settings

2. **Email Not Sending**:
   - Verify email provider credentials
   - Check spam folders
   - Test with different email providers

3. **Admin Login Issues**:
   - Verify ADMIN_PASSWORD is set
   - Check password hashing
   - Clear browser cache

4. **Build Failures**:
   - Check Node.js version (18+)
   - Verify all dependencies installed
   - Check for TypeScript errors

## 📞 Support

If you need help with deployment:
1. Check platform-specific documentation
2. Review error logs in hosting dashboard
3. Test locally first
4. Contact platform support if needed

## 🎯 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp env.example .env.local
# Edit .env.local with your settings

# 3. Set up database
npm run db:generate
npm run db:push
npm run db:seed

# 4. Test locally
npm run dev

# 5. Build for production
npm run build
npm start
```

Your Partner Pricing Platform is ready for production deployment! 🚀
