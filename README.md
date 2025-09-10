# Partner Pricing Platform

A centralized, multi-tenant pricing calculator platform built with Next.js, TypeScript, Tailwind CSS, and Prisma (PostgreSQL).

## Features

- **Multi-tenant Architecture**: Each partner has their own branded calculator
- **Admin Control Panel**: Protected admin interface for managing partners and quotes
- **Version Control**: Draft and published versions with rollback capability
- **Flexible Pricing Engine**: JSONLogic-lite based pricing rules
- **Email Integration**: Support for Postmark and SMTP email providers
- **Quote Management**: Full quote lifecycle with edit and resend functionality

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd partner-pricing-platform
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/partner_pricing_platform"
   
   # Admin Authentication
   ADMIN_PASSWORD="your-secure-admin-password"
   
   # Email Configuration
   EMAIL_PROVIDER="smtp" # or "postmark"
   EMAIL_FROM="noreply@yourdomain.com"
   
   # Postmark Configuration (if using Postmark)
   POSTMARK_KEY="your-postmark-api-key"
   
   # SMTP Configuration (if using SMTP)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with example data
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Main page: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - Example calculators:
     - ACME: http://localhost:3000/p/acme
     - Blue Rocket: http://localhost:3000/p/blue-rocket

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ADMIN_PASSWORD` | Admin panel password (will be hashed) | Yes |
| `EMAIL_PROVIDER` | Email provider: "smtp" or "postmark" | Yes |
| `EMAIL_FROM` | From email address | Yes |
| `POSTMARK_KEY` | Postmark API key (if using Postmark) | If using Postmark |
| `SMTP_HOST` | SMTP server host | If using SMTP |
| `SMTP_PORT` | SMTP server port | If using SMTP |
| `SMTP_SECURE` | Use SSL/TLS | If using SMTP |
| `SMTP_USER` | SMTP username | If using SMTP |
| `SMTP_PASS` | SMTP password | If using SMTP |

## Architecture

### Database Schema

- **Partners**: Core partner information and configuration
- **PartnerVersions**: Version control for partner configurations
- **Quotes**: Generated quotes with pricing and inputs
- **AdminSessions**: Admin authentication sessions

### API Routes

#### Public Routes
- `GET /api/public/partner/[slug]` - Get published partner configuration
- `POST /api/public/quote` - Generate and send quote

#### Admin Routes
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/partners` - List all partners
- `POST /api/admin/partners` - Create new partner
- `GET /api/admin/partners/[id]` - Get partner details
- `PUT /api/admin/partners/[id]` - Update partner
- `DELETE /api/admin/partners/[id]` - Delete partner
- `POST /api/admin/partners/[id]/publish` - Publish partner version
- `POST /api/admin/partners/[id]/rollback` - Rollback to previous version
- `GET /api/admin/quotes` - List quotes with filters
- `GET /api/admin/quotes/[id]` - Get quote details
- `POST /api/admin/quotes/[id]/resend` - Resend quote with updated pricing

### Pricing Engine

The pricing engine supports JSONLogic-lite expressions with the following operations:

- **Variables**: `{ "op": "var", "args": ["fieldName"] }`
- **Arithmetic**: `add`, `multiply`, `subtract`
- **Comparisons**: `gte`, `lte`, `gt`, `lt`
- **Array operations**: `length`, `in`
- **Conditionals**: `case-when`

#### Rule Types

1. **setSubtotalFromBase**: Set base price from lookup table
2. **setSubtotalFromMatrix**: Set base price from matrix lookup
3. **add**: Add fixed amount or calculated value
4. **multiply**: Apply multiplier to current subtotal

## Example Partners

The seed script creates two example partners:

### ACME Corporation
- **Slug**: `acme`
- **Base Pricing**: Marketing Website ($5,000), Web App ($20,000), E-commerce ($15,000)
- **Add-ons**: CMS (+$2,500), Integrations (+$1,500 each), Rush (+25%)

### Blue Rocket Agency
- **Slug**: `blue-rocket`
- **Matrix Pricing**: Project type × CMS tier matrix
- **Add-ons**: Languages ((n-1)×$800), Integrations (+$1,200 each), SEO (+$900), Rush (+20%)

## Testing Acceptance Criteria

The platform includes test cases for the following scenarios:

1. **ACME Marketing Website + CMS + 2 integrations, no rush** = $10,500
2. **ACME Web App + rush** = $25,000
3. **Blue Rocket Marketing Site × Standard + CMS + SEO + 3 languages + 1 integration + rush** = $18,240

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with example data
- `npm run db:studio` - Open Prisma Studio

### Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── p/[partnerSlug]/   # Public calculator pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── email-providers.ts # Email provider implementations
│   ├── middleware.ts     # API middleware
│   ├── pricing-engine.ts # Pricing calculation engine
│   └── prisma.ts         # Prisma client
└── types/                 # TypeScript type definitions
```

## Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set up production environment variables**

3. **Run database migrations:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start the production server:**
   ```bash
   npm start
   ```

## Security Considerations

- Admin password is hashed using bcrypt
- JWT tokens for admin sessions with expiration
- Input validation on all API endpoints
- SQL injection protection via Prisma
- CORS configuration for API routes

## License

MIT License - see LICENSE file for details.
