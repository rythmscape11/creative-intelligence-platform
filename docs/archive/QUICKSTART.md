# MediaPlanPro - Quick Start Guide

Get MediaPlanPro up and running in 5 minutes!

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 18.x or higher installed
- ✅ npm or yarn package manager
- ✅ Git installed

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/mediaplanpro.git
cd mediaplanpro
```

## Step 2: Automated Setup (Recommended)

Run the automated setup script:

```bash
chmod +x scripts/setup-env.sh
./scripts/setup-env.sh
```

This script will:
- Install all dependencies
- Create `.env` file from template
- Generate Prisma client
- Run database migrations
- Optionally seed sample data

**Answer "y" when prompted to seed the database for a complete demo experience.**

## Step 3: Configure Environment (Manual)

If you prefer manual setup or need to update configuration:

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use your preferred editor
```

### Minimum Required Configuration

Update these values in `.env`:

```bash
# Database (SQLite for development - no changes needed)
DATABASE_URL="file:./dev.db"

# Authentication (generate a secret)
NEXTAUTH_SECRET="your-generated-secret-here"

# OpenAI (optional for testing - uses fallback rules engine if not set)
OPENAI_API_KEY="sk-your-key-here"
```

### Generate NEXTAUTH_SECRET

```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 4: Install Dependencies (if not using setup script)

```bash
npm install
```

## Step 5: Setup Database (if not using setup script)

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed sample data (optional but recommended)
node scripts/seed-all-data.js
```

## Step 6: Start Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** in your browser!

## Step 7: Login with Sample Accounts

If you seeded the database, you can login with these accounts:

### Admin Account
- **Email**: admin@mediaplanpro.com
- **Password**: admin123
- **Access**: Full system access

### Editor Account
- **Email**: editor@mediaplanpro.com
- **Password**: editor123
- **Access**: Content management

### User Account
- **Email**: user@mediaplanpro.com
- **Password**: user123
- **Access**: Strategy creation and export

## What's Included in Sample Data?

When you seed the database, you get:

### 👥 Users
- 4 user accounts (Admin, Editor, 2 Users)

### 📝 Blog Content
- 5 categories (Marketing Strategy, Digital Marketing, etc.)
- 12 tags (SEO, PPC, Email Marketing, etc.)
- 4 blog posts (3 published, 1 draft)

### 📊 Strategies
- 3 complete marketing strategies:
  - TechStart Inc. (Technology)
  - EcoProducts Co. (E-commerce)
  - HealthFit Gym (Fitness & Wellness)

### 📤 Exports
- 2 sample exports (PPTX, DOCX)

## Quick Feature Tour

### 1. Create a Marketing Strategy

1. Login with any user account
2. Click "Create Strategy" or navigate to `/strategies/new`
3. Fill in the multi-step form:
   - Business details
   - Target audience
   - Budget and objectives
   - Challenges and timeframe
4. Click "Generate Strategy"
5. View your AI-generated (or rules-based) strategy

### 2. Export a Strategy

1. Open any strategy
2. Click "Export" button
3. Choose format (PPTX, DOCX, or XLSX)
4. Wait for processing
5. Download your file

### 3. Manage Blog Content (Editor/Admin)

1. Login as editor or admin
2. Navigate to `/blog/admin`
3. Create, edit, or delete blog posts
4. Manage categories and tags
5. Publish or schedule posts

### 4. Admin Dashboard (Admin Only)

1. Login as admin
2. Navigate to `/admin`
3. View system statistics
4. Manage users
5. Monitor content and storage

## Common Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server

# Database
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create new migration
npx prisma generate      # Regenerate Prisma client

# Testing
npm test                 # Run all tests
npm test -- --watch      # Run tests in watch mode
npm test -- --coverage   # Run tests with coverage

# Linting
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues

# Seeding
node scripts/seed-blog-data.js    # Seed blog data only
node scripts/seed-all-data.js     # Seed all sample data
```

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Database Connection Issues

```bash
# Reset database
rm -f prisma/dev.db
npx prisma migrate dev --name init
node scripts/seed-all-data.js
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Prisma Client Issues

```bash
# Regenerate Prisma client
npx prisma generate
```

## Next Steps

Now that you have MediaPlanPro running:

1. **Explore Features**: Try creating strategies, exporting files, and managing blog content
2. **Read Documentation**: Check out the comprehensive guides in the `docs/` folder
3. **Run Tests**: Execute `npm test` to see the test suite in action
4. **Customize**: Modify the code to fit your specific needs
5. **Deploy**: When ready, follow the deployment guide in `docs/DEPLOYMENT.md`

## Additional Resources

- 📚 [Full Documentation](./docs/)
- 🔧 [API Reference](./docs/API.md)
- 🚀 [Deployment Guide](./docs/DEPLOYMENT.md)
- 🏗️ [Architecture Overview](./docs/ARCHITECTURE.md)
- 🧪 [Testing Guide](./docs/TESTING.md)
- 🤝 [Contributing Guide](./docs/CONTRIBUTING.md)

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review the documentation in `docs/`
3. Check existing GitHub issues
4. Create a new issue with details about your problem

## What's Next?

### For Development
- Customize the UI components
- Add new features
- Integrate additional services
- Extend the API

### For Production
- Configure production environment variables
- Set up PostgreSQL database
- Configure AWS S3 bucket
- Set up monitoring with Sentry
- Deploy to Vercel or your preferred platform

---

**🎉 Congratulations!** You now have MediaPlanPro running locally.

Happy coding! 🚀
