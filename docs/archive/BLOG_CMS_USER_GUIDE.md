# MediaPlanPro Blog CMS - User Guide

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Managing Blog Posts](#managing-blog-posts)
5. [Creating a New Post](#creating-a-new-post)
6. [Editing Posts](#editing-posts)
7. [Rich Text Editor](#rich-text-editor)
8. [SEO Optimization](#seo-optimization)
9. [Publishing & Scheduling](#publishing--scheduling)
10. [Bulk Actions](#bulk-actions)

---

## Overview

The MediaPlanPro Blog CMS is a comprehensive content management system that allows administrators and editors to create, edit, and publish blog posts with a professional rich text editor, SEO optimization, and advanced features.

### Key Features
- ✅ **Rich Text Editor** - WYSIWYG editor with formatting options
- ✅ **SEO Optimization** - Meta titles, descriptions, and slug management
- ✅ **Categories & Tags** - Organize content with categories and tags
- ✅ **Auto-save** - Automatic draft saving every 30 seconds
- ✅ **Live Preview** - See how your post will look before publishing
- ✅ **Bulk Actions** - Manage multiple posts at once
- ✅ **Related Posts** - Automatically suggest related content
- ✅ **Role-Based Access** - Different permissions for admins and editors

---

## Getting Started

### Accessing the CMS

1. Log in to your MediaPlanPro account
2. Navigate to `/dashboard/blog`
3. You'll see the Blog Management Dashboard

### Dashboard Overview

The dashboard displays:
- **List of all blog posts** with title, author, category, status, and date
- **Filter controls** to search and filter posts
- **Bulk action buttons** for managing multiple posts
- **Create New Post button** in the top right

---

## User Roles & Permissions

### ADMIN
- ✅ Create, edit, and delete any blog post
- ✅ Publish, archive, and schedule posts
- ✅ Perform bulk actions including delete
- ✅ Manage categories and tags
- ✅ Access all CMS features

### EDITOR
- ✅ Create and edit their own blog posts
- ✅ Edit (but not delete) other users' posts
- ✅ Publish and archive posts
- ✅ Create new tags
- ⛔ Cannot delete posts (admin only)
- ⛔ Cannot create categories (admin only)

### USER
- ⛔ No access to Blog CMS
- ✅ Can read published blog posts

---

## Managing Blog Posts

### Viewing Posts

The blog management dashboard shows all posts in a table format:

| Column | Description |
|--------|-------------|
| **Checkbox** | Select posts for bulk actions |
| **Title** | Post title with excerpt and tags |
| **Author** | Post author with avatar |
| **Category** | Post category with color badge |
| **Status** | DRAFT, PUBLISHED, SCHEDULED, or ARCHIVED |
| **Date** | Published or created date |
| **Actions** | Preview, Edit, Duplicate, Delete buttons |

### Filtering Posts

Use the filter controls to find specific posts:

1. **Search** - Search by title, content, or excerpt
2. **Status** - Filter by DRAFT, PUBLISHED, SCHEDULED, or ARCHIVED
3. **Category** - Filter by specific category
4. **Advanced Filters** (click "Show Advanced Filters"):
   - Sort by: Created Date, Updated Date, Published Date, or Title
   - Sort order: Newest First or Oldest First
   - Date range: Filter by start and end dates

### Pagination

- **20 posts per page** by default
- Use pagination controls at the bottom to navigate pages
- Shows total posts and current page

---

## Creating a New Post

### Step 1: Click "New Post"

Click the **"+ New Post"** button in the top right of the dashboard.

### Step 2: Fill in Required Fields

#### Title (Required)
- Maximum 200 characters
- Auto-generates slug from title
- Example: "10 Marketing Strategies for 2024"

#### Slug (Required)
- Auto-generated from title
- Can be manually edited
- Must be lowercase with hyphens
- Example: `10-marketing-strategies-for-2024`

#### Content (Required)
- Use the rich text editor to write your post
- Minimum 100 characters
- See [Rich Text Editor](#rich-text-editor) section for details

#### Excerpt (Required)
- Brief summary for SEO and previews
- 150-160 characters recommended
- Maximum 300 characters

#### Category (Required)
- Select from dropdown
- Each post must have one category

#### Tags (Required)
- Select at least 2 tags
- Click tags to toggle selection
- Tags help with SEO and related posts

### Step 3: Optional Fields

#### Featured Image
- Enter Unsplash URL or image URL
- Displays in blog list and post header
- Recommended size: 1200x630px

#### SEO Settings
- **SEO Title**: Defaults to post title (max 70 chars)
- **SEO Description**: Defaults to excerpt (max 160 chars)

#### Publishing Options
- **Status**: DRAFT, PUBLISHED, SCHEDULED, or ARCHIVED
- **Publish Date**: Set future date for scheduled posts

### Step 4: Save or Publish

- Click **"Create Post"** to save
- Post is saved with selected status
- Redirects to blog management dashboard

---

## Editing Posts

### Opening the Editor

1. Click the **Edit icon** (pencil) next to any post
2. Or click the post title in the dashboard
3. Opens `/dashboard/blog/edit/[id]`

### Auto-Save

- **Automatically saves every 30 seconds**
- Shows "Auto-saving..." indicator when saving
- Only works for existing posts (not new drafts)

### Permissions

- **Editors** can only edit their own posts
- **Admins** can edit any post
- Access denied message shown if unauthorized

---

## Rich Text Editor

### Toolbar Options

#### Headings
- **H1** - Main title (use sparingly)
- **H2** - Section headings
- **H3** - Subsection headings
- **H4** - Minor headings

#### Text Formatting
- **Bold** (B) - Make text bold
- **Italic** (I) - Make text italic
- **Underline** (U) - Underline text

#### Lists
- **Bullet List** - Unordered list
- **Numbered List** - Ordered list

#### Links & Images
- **🔗 Link** - Add hyperlinks
  1. Click Link button
  2. Enter URL in prompt
  3. Text becomes clickable link

- **🖼️ Image** - Insert images
  1. Click Image button
  2. Enter image URL
  3. Image appears in editor

#### Code
- **</> Code** - Code blocks for technical content

#### Callout Boxes
- **💡 Pro Tip** - Highlight helpful tips
- **🎯 Expert** - Expert insights
- **📢 CTA** - Call-to-action boxes

### Formatting Best Practices

1. **Use headings hierarchically** - H1 → H2 → H3 → H4
2. **Keep paragraphs short** - 2-3 sentences maximum
3. **Use lists for readability** - Break up long content
4. **Add images** - Visual content improves engagement
5. **Use callout boxes** - Highlight important information

---

## SEO Optimization

### SEO Title
- **Recommended**: 50-60 characters
- **Maximum**: 70 characters
- Include primary keyword
- Make it compelling and clickable

### SEO Description
- **Recommended**: 150-160 characters
- **Maximum**: 160 characters
- Include primary keyword
- Summarize the post value

### Slug
- Keep it short and descriptive
- Use hyphens, not underscores
- Include primary keyword
- Example: `marketing-strategy-guide`

### Tags
- Use at least 2 tags
- Include relevant keywords
- Help with internal linking and related posts

---

## Publishing & Scheduling

### Post Statuses

#### DRAFT
- Not visible to public
- Can be edited and previewed
- Default status for new posts

#### PUBLISHED
- Visible to public immediately
- Appears in blog list
- Indexed by search engines

#### SCHEDULED
- Set future publish date
- Automatically publishes at specified time
- Shows scheduled date in dashboard

#### ARCHIVED
- Not visible to public
- Kept for reference
- Can be republished later

### Publishing Workflow

1. **Create Draft** - Write and save as draft
2. **Review** - Use preview to check formatting
3. **Optimize SEO** - Add meta title and description
4. **Publish** - Change status to PUBLISHED
5. **Or Schedule** - Set future date for scheduled publishing

---

## Bulk Actions

### Selecting Posts

1. **Select individual posts** - Click checkbox next to each post
2. **Select all posts** - Click checkbox in table header
3. **Selected count** shows in blue banner

### Available Actions

#### Publish
- Changes status to PUBLISHED
- Sets publish date to now
- Available to all selected posts

#### Archive
- Changes status to ARCHIVED
- Removes from public view
- Can be republished later

#### Delete (Admin Only)
- Permanently deletes posts
- **Cannot be undone**
- Confirmation required

#### Change Category (Future Feature)
- Bulk update category
- Coming soon

### Using Bulk Actions

1. Select posts using checkboxes
2. Blue banner appears with action buttons
3. Click desired action button
4. Confirm if prompted
5. Posts updated immediately

---

## Tips & Best Practices

### Content Creation
- ✅ Write compelling titles (50-60 characters)
- ✅ Use short paragraphs (2-3 sentences)
- ✅ Add images every 300-500 words
- ✅ Use headings to structure content
- ✅ Include callout boxes for key points

### SEO
- ✅ Research keywords before writing
- ✅ Include keyword in title, slug, and first paragraph
- ✅ Write unique meta descriptions
- ✅ Use at least 2 relevant tags
- ✅ Add alt text to images (future feature)

### Publishing
- ✅ Preview before publishing
- ✅ Check all links work
- ✅ Verify images load correctly
- ✅ Review on mobile (use preview)
- ✅ Schedule posts for optimal times

### Organization
- ✅ Use consistent categories
- ✅ Tag posts thoroughly
- ✅ Archive outdated content
- ✅ Update old posts regularly
- ✅ Use drafts for work-in-progress

---

## Troubleshooting

### Common Issues

**Q: Auto-save not working?**
A: Auto-save only works for existing posts, not new drafts. Save the post first, then auto-save will activate.

**Q: Can't delete a post?**
A: Only admins can delete posts. Editors can archive posts instead.

**Q: Slug already exists error?**
A: Each slug must be unique. Try adding a number or date to the slug.

**Q: Can't see my post on the blog?**
A: Check the status is PUBLISHED and not DRAFT or ARCHIVED.

**Q: Images not loading?**
A: Verify the image URL is correct and publicly accessible.

---

## Support

For additional help or feature requests:
- Email: support@mediaplanpro.com
- Documentation: /docs/blog-cms
- Video Tutorials: /tutorials/blog-cms

---

**Last Updated**: October 10, 2025
**Version**: 1.0.0

