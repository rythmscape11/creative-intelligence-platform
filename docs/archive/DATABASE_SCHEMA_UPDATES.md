# Database Schema Updates for CMS Features

**Date**: October 9, 2024  
**Purpose**: Add CMS and Strategy Management features

---

## Schema Changes

### 1. MarketingStrategy Model Enhancements

**New Fields**:
- `name` (String, optional) - Strategy name for easier identification
- `status` (String, default: "DRAFT") - DRAFT, ACTIVE, COMPLETED, ARCHIVED
- `tags` (String, optional) - Comma-separated tags
- `notes` (String, optional) - User notes/comments
- `version` (Int, default: 1) - Version number for history
- `isArchived` (Boolean, default: false) - Soft delete flag

**New Relations**:
- `comments` - One-to-many with StrategyComment
- `versions` - One-to-many with StrategyVersion

### 2. New Models

#### StrategyComment
```prisma
model StrategyComment {
  id         String   @id @default(cuid())
  strategyId String
  userId     String
  content    String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

#### StrategyVersion
```prisma
model StrategyVersion {
  id         String   @id @default(cuid())
  strategyId String
  version    Int
  input      String
  output     String?
  createdBy  String
  createdAt  DateTime @default(now())
}
```

#### UserActivity
```prisma
model UserActivity {
  id          String   @id @default(cuid())
  userId      String
  action      String
  entityType  String?
  entityId    String?
  details     String?
  ipAddress   String?
  userAgent   String?
  timestamp   DateTime @default(now())
}
```

#### SiteSettings
```prisma
model SiteSettings {
  id          String   @id @default(cuid())
  key         String   @unique
  value       String
  category    String
  description String?
  updatedAt   DateTime @updatedAt
}
```

#### Redirect
```prisma
model Redirect {
  id          String   @id @default(cuid())
  fromPath    String   @unique
  toPath      String
  type        Int      @default(301)
  isActive    Boolean  @default(true)
  hitCount    Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 3. Analytics Model Enhancements

**New Fields**:
- `ipAddress` (String, optional)
- `userAgent` (String, optional)
- `referrer` (String, optional)
- `page` (String, optional)

---

## Migration Instructions

### For Development (SQLite):

Since we're using SQLite in development, we need to handle migrations carefully:

```bash
# 1. Backup current database
cp prisma/dev.db prisma/dev.db.backup

# 2. Generate Prisma client with new schema
npx prisma generate

# 3. Create migration (this will prompt for migration name)
npx prisma migrate dev --name add_cms_features

# 4. If migration fails, you may need to reset the database
# WARNING: This will delete all data!
npx prisma migrate reset

# 5. Re-seed the database
npm run seed:blog
npx tsx scripts/update-user-passwords.ts
```

### For Production (PostgreSQL):

```bash
# 1. Update schema.prisma datasource to PostgreSQL
# datasource db {
#   provider = "postgresql"
#   url      = env("DATABASE_URL")
# }

# 2. Create migration
npx prisma migrate deploy

# 3. Generate Prisma client
npx prisma generate
```

---

## Manual SQL Updates (if needed)

If you need to manually update the database without resetting:

### Add columns to marketing_strategies:
```sql
ALTER TABLE marketing_strategies ADD COLUMN name TEXT;
ALTER TABLE marketing_strategies ADD COLUMN status TEXT DEFAULT 'DRAFT';
ALTER TABLE marketing_strategies ADD COLUMN tags TEXT;
ALTER TABLE marketing_strategies ADD COLUMN notes TEXT;
ALTER TABLE marketing_strategies ADD COLUMN version INTEGER DEFAULT 1;
ALTER TABLE marketing_strategies ADD COLUMN isArchived INTEGER DEFAULT 0;
```

### Create new tables:
```sql
CREATE TABLE strategy_comments (
  id TEXT PRIMARY KEY,
  strategyId TEXT NOT NULL,
  userId TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (strategyId) REFERENCES marketing_strategies(id) ON DELETE CASCADE
);

CREATE TABLE strategy_versions (
  id TEXT PRIMARY KEY,
  strategyId TEXT NOT NULL,
  version INTEGER NOT NULL,
  input TEXT NOT NULL,
  output TEXT,
  createdBy TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (strategyId) REFERENCES marketing_strategies(id) ON DELETE CASCADE
);

CREATE TABLE user_activities (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  action TEXT NOT NULL,
  entityType TEXT,
  entityId TEXT,
  details TEXT,
  ipAddress TEXT,
  userAgent TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE site_settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE redirects (
  id TEXT PRIMARY KEY,
  fromPath TEXT UNIQUE NOT NULL,
  toPath TEXT NOT NULL,
  type INTEGER DEFAULT 301,
  isActive INTEGER DEFAULT 1,
  hitCount INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Add columns to analytics:
```sql
ALTER TABLE analytics ADD COLUMN ipAddress TEXT;
ALTER TABLE analytics ADD COLUMN userAgent TEXT;
ALTER TABLE analytics ADD COLUMN referrer TEXT;
ALTER TABLE analytics ADD COLUMN page TEXT;
```

---

## Verification

After migration, verify the schema:

```bash
# Check Prisma schema
npx prisma db pull

# Inspect database
sqlite3 prisma/dev.db ".schema"

# Or for specific tables
sqlite3 prisma/dev.db ".schema marketing_strategies"
sqlite3 prisma/dev.db ".schema strategy_comments"
```

---

## Rollback Plan

If something goes wrong:

```bash
# 1. Restore backup
cp prisma/dev.db.backup prisma/dev.db

# 2. Revert schema changes in prisma/schema.prisma

# 3. Regenerate client
npx prisma generate
```

---

## Next Steps

After successful migration:

1. ✅ Update Prisma client types
2. ✅ Update API routes to handle new fields
3. ✅ Update UI components to display new data
4. ✅ Test all CRUD operations
5. ✅ Verify relationships work correctly

---

## Notes

- All JSON fields are stored as strings and need to be parsed/stringified
- SQLite uses INTEGER for booleans (0 = false, 1 = true)
- Timestamps are stored as DATETIME in SQLite
- Foreign key constraints are enforced with ON DELETE CASCADE
- Unique constraints are enforced on specified fields

---

**Status**: Schema updated, ready for migration

