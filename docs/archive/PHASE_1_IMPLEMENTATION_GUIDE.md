# 🚀 Phase 1 Implementation Guide - Week 1

## 📋 Overview

**Goal:** Launch 5 simple marketing tools with usage tracking  
**Timeline:** Week 1 (5-7 days)  
**Deliverables:** Tools landing page + 5 working tools + usage tracking

---

## ✅ Pre-Implementation Checklist

- [x] Database schema added (`ToolUsage`, `DailyToolLimit`)
- [x] Documentation complete
- [ ] Database migration run
- [ ] Dependencies installed
- [ ] Folder structure created
- [ ] Shared components built
- [ ] API routes implemented
- [ ] First tool launched

---

## 📦 Step 1: Database Migration (5 minutes)

### Run Migration
```bash
cd /Users/anustupmukherjee/Documents/augment-projects/Project\ 1

# Run migration
npx prisma migrate dev --name add_marketing_tools

# Generate Prisma client
npx prisma generate

# Verify migration
npx prisma studio
# Check that ToolUsage and DailyToolLimit tables exist
```

**Expected Output:**
```
✔ Generated Prisma Client
✔ Migration applied successfully
```

---

## 📦 Step 2: Install Dependencies (2 minutes)

```bash
# PDF export
npm install jspdf

# Charts for ROI Calculator
npm install recharts

# Type definitions
npm install -D @types/jspdf

# Verify installation
npm list jspdf recharts
```

---

## 📁 Step 3: Create Folder Structure (2 minutes)

```bash
# App routes
mkdir -p src/app/tools/content
mkdir -p src/app/tools/seo
mkdir -p src/app/tools/social
mkdir -p src/app/tools/email
mkdir -p src/app/tools/advertising

# Components
mkdir -p src/components/tools/shared

# Libraries (algorithms)
mkdir -p src/lib/tools/content
mkdir -p src/lib/tools/seo
mkdir -p src/lib/tools/social
mkdir -p src/lib/tools/email
mkdir -p src/lib/tools/advertising
mkdir -p src/lib/tools/shared

# Types
mkdir -p src/types

# API routes
mkdir -p src/app/api/tools/track-usage
mkdir -p src/app/api/tools/check-limit
mkdir -p src/app/api/tools/get-stats
```

---

## 🎨 Step 4: Create Shared Types (5 minutes)

### File: `src/types/tools.ts`

```typescript
export type ToolCategory = 'content' | 'seo' | 'social' | 'email' | 'advertising';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: React.ComponentType;
  href: string;
  isPro: boolean;
  value: number; // Monthly value in USD
}

export interface ToolUsageLimit {
  canUse: boolean;
  remaining: number;
  limit: number;
  isPro: boolean;
  usedToday: number;
}

export interface ExportOptions {
  copy?: boolean;
  pdf?: boolean;
  csv?: boolean;
  json?: boolean;
}
```

---

## 🔧 Step 5: Create Shared Utilities (15 minutes)

### File: `src/lib/tools/shared/exportUtils.ts`

```typescript
import jsPDF from 'jspdf';

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function exportToPDF(data: {
  title: string;
  content: string;
  metadata?: Record<string, any>;
}) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text(data.title, 20, 20);
  
  // Content
  doc.setFontSize(12);
  const lines = doc.splitTextToSize(data.content, 170);
  doc.text(lines, 20, 40);
  
  // Download
  doc.save(`${data.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}

export function exportToCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => row[h]).join(','))
  ].join('\n');
  
  downloadFile(csv, filename, 'text/csv');
}

export function exportToJSON(data: any, filename: string) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

### File: `src/lib/utils/toolUsageTracker.ts`

```typescript
import { ToolCategory } from '@/types/tools';

export async function trackToolUsage(
  toolId: string,
  toolName: string,
  category: ToolCategory,
  metadata?: any
): Promise<void> {
  try {
    await fetch('/api/tools/track-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId, toolName, category, metadata })
    });
  } catch (error) {
    console.error('Failed to track tool usage:', error);
  }
}

export async function checkUsageLimit(toolId: string): Promise<{
  canUse: boolean;
  remaining: number;
  limit: number;
  isPro: boolean;
  usedToday: number;
}> {
  try {
    const res = await fetch(`/api/tools/check-limit?toolId=${toolId}`);
    return await res.json();
  } catch (error) {
    console.error('Failed to check usage limit:', error);
    return { canUse: true, remaining: 10, limit: 10, isPro: false, usedToday: 0 };
  }
}
```

---

## 🔌 Step 6: Create API Routes (20 minutes)

### File: `src/app/api/tools/track-usage/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { toolId, toolName, category, metadata } = await req.json();

    // Track usage
    await prisma.toolUsage.create({
      data: {
        userId: session.user.id,
        toolId,
        toolName,
        category,
        metadata: metadata || {}
      }
    });

    // Update daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.dailyToolLimit.upsert({
      where: {
        userId_toolId_date: {
          userId: session.user.id,
          toolId,
          date: today
        }
      },
      update: {
        count: { increment: 1 }
      },
      create: {
        userId: session.user.id,
        toolId,
        date: today,
        count: 1
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track usage error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### File: `src/app/api/tools/check-limit/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const FREE_TIER_LIMIT = 10;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const toolId = req.nextUrl.searchParams.get('toolId');
    if (!toolId) {
      return NextResponse.json({ error: 'Tool ID required' }, { status: 400 });
    }

    // Check if user is Pro
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true }
    });

    const isPro = user?.subscription?.status === 'ACTIVE';

    // Pro users have unlimited usage
    if (isPro) {
      return NextResponse.json({
        canUse: true,
        remaining: -1, // Unlimited
        limit: -1,
        isPro: true,
        usedToday: 0
      });
    }

    // Check daily usage for free users
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyLimit = await prisma.dailyToolLimit.findUnique({
      where: {
        userId_toolId_date: {
          userId: session.user.id,
          toolId,
          date: today
        }
      }
    });

    const usedToday = dailyLimit?.count || 0;
    const remaining = Math.max(0, FREE_TIER_LIMIT - usedToday);
    const canUse = remaining > 0;

    return NextResponse.json({
      canUse,
      remaining,
      limit: FREE_TIER_LIMIT,
      isPro: false,
      usedToday
    });
  } catch (error) {
    console.error('Check limit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## 🎨 Step 7: Create Shared Components (30 minutes)

### File: `src/components/tools/ToolCard.tsx`

```typescript
import Link from 'next/link';
import { Tool } from '@/types/tools';

const categoryColors = {
  content: 'blue',
  seo: 'green',
  social: 'purple',
  email: 'orange',
  advertising: 'red'
};

export function ToolCard({ tool }: { tool: Tool }) {
  const color = categoryColors[tool.category];
  
  return (
    <Link
      href={tool.href}
      className={`block p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-${color}-200 dark:border-${color}-800 hover:border-${color}-500 dark:hover:border-${color}-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 bg-${color}-100 dark:bg-${color}-900 rounded-lg`}>
          <tool.icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {tool.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {tool.description}
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 bg-${color}-100 dark:bg-${color}-900 text-${color}-700 dark:text-${color}-300 rounded`}>
              {tool.category}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ${tool.value}/mo value
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### File: `src/components/tools/UsageLimitBanner.tsx`

```typescript
'use client';

import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface UsageLimitBannerProps {
  used: number;
  limit: number;
  toolName: string;
}

export function UsageLimitBanner({ used, limit, toolName }: UsageLimitBannerProps) {
  const percentage = (used / limit) * 100;
  const isWarning = percentage >= 80;
  const isLimit = used >= limit;

  if (!isWarning) return null;

  return (
    <div className={`p-4 rounded-lg border-2 ${
      isLimit 
        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
    }`}>
      <div className="flex items-start gap-3">
        <AlertCircle className={`w-5 h-5 mt-0.5 ${
          isLimit ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
        }`} />
        <div className="flex-1">
          <h4 className={`font-semibold ${
            isLimit ? 'text-red-900 dark:text-red-100' : 'text-yellow-900 dark:text-yellow-100'
          }`}>
            {isLimit ? 'Daily Limit Reached' : 'Approaching Daily Limit'}
          </h4>
          <p className={`text-sm mt-1 ${
            isLimit ? 'text-red-700 dark:text-red-300' : 'text-yellow-700 dark:text-yellow-300'
          }`}>
            {isLimit 
              ? `You've used all ${limit} free uses of ${toolName} today.`
              : `You've used ${used} of ${limit} free uses today.`
            }
          </p>
          <Link
            href="/pricing"
            className={`inline-block mt-2 text-sm font-semibold ${
              isLimit ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
            } hover:underline`}
          >
            Upgrade to Pro for unlimited usage →
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 Step 8: Build First Tool - ROI Calculator (45 minutes)

This will be covered in a separate detailed guide for each tool.

**For now, the foundation is complete!**

---

## ✅ Phase 1 Checklist

- [ ] Step 1: Database migration run
- [ ] Step 2: Dependencies installed
- [ ] Step 3: Folder structure created
- [ ] Step 4: Shared types created
- [ ] Step 5: Shared utilities created
- [ ] Step 6: API routes implemented
- [ ] Step 7: Shared components created
- [ ] Step 8: ROI Calculator built
- [ ] Step 9: CPC/CPM Calculator built
- [ ] Step 10: Engagement Calculator built
- [ ] Step 11: SERP Preview built
- [ ] Step 12: UTM Builder built
- [ ] Step 13: Tools landing page created
- [ ] Step 14: Testing complete
- [ ] Step 15: Documentation updated

---

## 🚀 Ready to Start!

Run the first 7 steps now to set up the foundation, then we'll build each tool one by one.

**Let's do this!** 💪

