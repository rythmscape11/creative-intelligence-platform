# Console.log Replacement Progress

## ✅ COMPLETED (6 files)

### Error Boundaries
1. ✅ `src/app/global-error.tsx` - Replaced console.error with logger.error
2. ✅ `src/app/error.tsx` - Replaced console.error with logger.error

### SEO Routes
3. ✅ `src/app/sitemap.xml/route.ts` - Replaced console.error with logger.error
4. ✅ `src/app/robots.txt/route.ts` - Replaced console.error with logger.error

### Admin API Routes
5. ✅ `src/app/api/admin/users/route.ts` - Replaced 2 console.error with logger.error

---

## 🔄 REMAINING FILES (40+ files)

### High Priority - API Routes (Security Critical)

#### Admin API Routes
- [ ] `src/app/api/admin/stats/route.ts` (1 occurrence)
- [ ] `src/app/api/admin/users/role/route.ts` (1 occurrence)
- [ ] `src/app/api/admin/users/bulk-role/route.ts`
- [ ] `src/app/api/admin/blog/posts/route.ts` (3 occurrences)
- [ ] `src/app/api/admin/blog/[id]/route.ts`
- [ ] `src/app/api/admin/activity/route.ts`

#### Strategy API Routes
- [ ] `src/app/api/strategies/route.ts`
- [ ] `src/app/api/strategies/[id]/route.ts`
- [ ] `src/app/api/strategies/[id]/export/route.ts`
- [ ] `src/app/api/strategies/[id]/versions/route.ts`
- [ ] `src/app/api/strategies/enhanced/route.ts`

#### Dashboard API Routes
- [ ] `src/app/api/dashboard/stats/route.ts`
- [ ] `src/app/api/dashboard/recent-activity/route.ts`

#### Growth Suite API Routes
- [ ] `src/app/api/growth-suite/attribution/report/route.ts`
- [ ] `src/app/api/growth-suite/usage/route.ts`

#### Blog API Routes
- [ ] `src/app/api/blog/posts/route.ts`
- [ ] `src/app/api/blog/[slug]/route.ts`

#### Auth API Routes
- [ ] `src/app/api/auth/[...nextauth]/route.ts`
- [ ] `src/app/api/auth/signup/route.ts`

### Medium Priority - Page Components

#### Dashboard Pages
- [ ] `src/app/dashboard/strategies/[id]/page.tsx`
- [ ] `src/app/dashboard/page.tsx`

#### Blog Pages
- [ ] `src/app/blog/tag/[slug]/page.tsx` (1 occurrence)
- [ ] `src/app/blog/category/[slug]/page.tsx`

### Low Priority - UI Components

#### Strategy Components
- [ ] `src/components/strategy/strategies-list.tsx` (5 occurrences)
  - Fetch strategies error
  - Delete strategy error
  - Duplicate strategy error
  - Toggle archive error
  - Bulk action error

- [ ] `src/components/strategy/export-strategy.tsx` (1 occurrence)
  - Failed to poll job status

#### Other Components
- [ ] `src/components/admin/user-management.tsx`
- [ ] `src/components/admin/blog-post-list.tsx`
- [ ] `src/components/analytics/blog-analytics.tsx`

---

## 📋 Replacement Pattern

### Import Statement
```typescript
import { logger } from '@/lib/services/logger-service';
```

### Replacement Rules

1. **console.error(message, error)**
   ```typescript
   // Before
   console.error('Error message:', error);
   
   // After
   logger.error('Error message', error as Error);
   ```

2. **console.log(message)**
   ```typescript
   // Before
   console.log('Info message:', data);
   
   // After
   logger.info('Info message', { data });
   ```

3. **console.warn(message)**
   ```typescript
   // Before
   console.warn('Warning message:', details);
   
   // After
   logger.warn('Warning message', { details });
   ```

4. **console.debug(message)**
   ```typescript
   // Before
   console.debug('Debug message:', value);
   
   // After
   logger.debug('Debug message', { value });
   ```

---

## 🎯 Next Steps

### Immediate (Today)
1. Fix all API route console.error statements (highest security priority)
2. Fix all page component console.error statements
3. Run build to verify no errors

### This Week
1. Fix all UI component console statements
2. Add proper error context to logger calls
3. Test error logging in development
4. Verify Sentry integration works

---

## 📊 Statistics

- **Total Files with Console Statements**: ~46
- **Total Console Statements**: ~60+
- **Files Fixed**: 6
- **Statements Fixed**: 8
- **Remaining**: ~40 files, ~52 statements

---

## ⚠️ Important Notes

1. **Don't remove console.log from logger-service.ts** - This is the logging implementation itself
2. **Context is important** - Add relevant context to logger calls:
   ```typescript
   logger.error('Failed to create user', error, {
     email: userEmail,
     role: userRole,
     timestamp: new Date().toISOString()
   });
   ```

3. **Security** - Never log sensitive data:
   - ❌ Passwords
   - ❌ API keys
   - ❌ Session tokens
   - ❌ Credit card numbers
   - ✅ User IDs (OK)
   - ✅ Email addresses (OK in server logs)
   - ✅ Error messages (OK)

4. **Production** - Logger automatically sends errors to Sentry in production

---

## 🔍 Finding Console Statements

```bash
# Find all console statements in src
grep -rn "console\.\(log\|error\|warn\|debug\)" src --include="*.ts" --include="*.tsx" | grep -v "logger-service.ts"

# Count total occurrences
grep -r "console\.\(log\|error\|warn\|debug\)" src --include="*.ts" --include="*.tsx" | grep -v "logger-service.ts" | wc -l
```

---

**Last Updated**: 2025-10-10  
**Status**: In Progress (6/46 files complete)

