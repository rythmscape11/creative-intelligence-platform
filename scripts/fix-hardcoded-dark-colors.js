const fs = require('fs');
const path = require('path');

// Files to update with their specific patterns
const files = [
  {
    path: 'src/components/tools/ToolCard.tsx',
    replacements: [
      // Card background
      { from: /className={`block p-6 bg-\[#0A0A0A\]/g, to: 'className={`block p-6 bg-white dark:bg-[#0A0A0A]' },
      
      // Icon backgrounds for all categories
      { from: /bg: 'bg-\[#1A1A1A\]'/g, to: "bg: 'bg-gray-100 dark:bg-[#1A1A1A]'" },
      
      // Borders for all categories
      { from: /border: 'border-\[#2A2A2A\]'/g, to: "border: 'border-gray-200 dark:border-[#2A2A2A]'" },
      
      // Text colors
      { from: /className="text-lg font-semibold text-white mb-2"/g, to: 'className="text-lg font-semibold text-gray-900 dark:text-white mb-2"' },
      { from: /className="text-sm text-gray-300 mb-3"/g, to: 'className="text-sm text-gray-600 dark:text-gray-300 mb-3"' },
      { from: /className="text-xs text-gray-400"/g, to: 'className="text-xs text-gray-500 dark:text-gray-400"' },
      
      // Badge text (keep dark for contrast with colored backgrounds)
      { from: /text-\[#0A0A0A\]/g, to: 'text-black dark:text-[#0A0A0A]' },
    ]
  },
  {
    path: 'src/components/tools/ToolLayout.tsx',
    replacements: [
      // Main backgrounds
      { from: /className="min-h-screen bg-bg-primary"/g, to: 'className="min-h-screen bg-white dark:bg-bg-primary"' },
      
      // Content card background
      { from: /className="bg-bg-secondary rounded-lg shadow-sm border border-border-primary p-4 sm:p-6 lg:p-8"/g, to: 'className="bg-gray-50 dark:bg-bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-border-primary p-4 sm:p-6 lg:p-8"' },
      
      // Text colors
      { from: /className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-2 sm:mb-3"/g, to: 'className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-text-primary mb-2 sm:mb-3"' },
      { from: /className="text-base sm:text-lg text-text-secondary"/g, to: 'className="text-base sm:text-lg text-gray-600 dark:text-text-secondary"' },
      { from: /className="mb-4 sm:mb-6 gap-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover"/g, to: 'className="mb-4 sm:mb-6 gap-2 text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-bg-hover"' },
      { from: /className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-text-tertiary px-4"/g, to: 'className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 dark:text-text-tertiary px-4"' },
    ]
  },
  {
    path: 'src/components/home/popular-resources.tsx',
    replacements: [
      // Fix hover state syntax (line 98)
      { from: /className="block p-4 rounded-lg border border-gray-200 dark:border-border-primary bg-white dark:bg-bg-primary hover:bg-gray-100 dark:bg-bg-elevated hover:border-border-hover transition-all group"/g, to: 'className="block p-4 rounded-lg border border-gray-200 dark:border-border-primary bg-white dark:bg-bg-primary hover:bg-gray-50 dark:hover:bg-bg-elevated hover:border-blue-500 dark:hover:border-border-hover transition-all group"' },
      
      // Fix hover state syntax (line 141)
      { from: /className="block p-4 rounded-lg border border-gray-200 dark:border-border-primary bg-white dark:bg-bg-primary hover:bg-gray-100 dark:bg-bg-elevated hover:border-border-hover transition-all group"/g, to: 'className="block p-4 rounded-lg border border-gray-200 dark:border-border-primary bg-white dark:bg-bg-primary hover:bg-gray-50 dark:hover:bg-bg-elevated hover:border-blue-500 dark:hover:border-border-hover transition-all group"' },
      
      // Fix hover state syntax (line 190)
      { from: /className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-200 dark:border-border-primary bg-white dark:bg-bg-primary text-gray-900 dark:text-text-primary font-medium hover:bg-gray-100 dark:bg-bg-elevated transition-colors"/g, to: 'className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-200 dark:border-border-primary bg-white dark:bg-bg-primary text-gray-900 dark:text-text-primary font-medium hover:bg-gray-50 dark:hover:bg-bg-elevated transition-colors"' },
    ]
  },
  {
    path: 'src/app/strategy/page.tsx',
    replacements: [
      // Header background
      { from: /className="bg-\[#1A1A1A\] border-b border-\[#2A2A2A\]"/g, to: 'className="bg-gray-100 dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-[#2A2A2A]"' },
      
      // Header text
      { from: /className="text-3xl font-bold text-white"/g, to: 'className="text-3xl font-bold text-gray-900 dark:text-white"' },
      { from: /className="mt-2 text-gray-300"/g, to: 'className="mt-2 text-gray-600 dark:text-gray-300"' },
      
      // Badge
      { from: /className="bg-\[#F59E0B\]\/10 border border-\[#F59E0B\]\/30 rounded-lg px-4 py-2"/g, to: 'className="bg-amber-50 dark:bg-[#F59E0B]/10 border border-amber-200 dark:border-[#F59E0B]/30 rounded-lg px-4 py-2"' },
      { from: /className="text-sm font-medium text-\[#F59E0B\]"/g, to: 'className="text-sm font-medium text-amber-600 dark:text-[#F59E0B]"' },
      { from: /className="text-xs text-gray-400"/g, to: 'className="text-xs text-gray-500 dark:text-gray-400"' },
    ]
  },
  {
    path: 'src/components/dashboard/dashboard-tile.tsx',
    replacements: [
      // Update category colors to support light/dark
      { from: /border: 'border-\[#2A2A2A\]'/g, to: "border: 'border-gray-200 dark:border-[#2A2A2A]'" },
      { from: /iconBg: 'bg-\[#1A1A1A\]'/g, to: "iconBg: 'bg-gray-100 dark:bg-[#1A1A1A]'" },
    ]
  },
  {
    path: 'src/components/legal/legal-page-layout.tsx',
    replacements: [
      // Main background
      { from: /className="min-h-screen bg-\[#0A0A0A\] py-12 px-4 sm:px-6 lg:px-8"/g, to: 'className="min-h-screen bg-white dark:bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8"' },
      
      // Link colors
      { from: /className="inline-flex items-center text-sm mb-6 text-\[#A0A0A0\] hover:text-\[#F59E0B\] transition-colors"/g, to: 'className="inline-flex items-center text-sm mb-6 text-gray-600 dark:text-[#A0A0A0] hover:text-blue-600 dark:hover:text-[#F59E0B] transition-colors"' },
    ]
  },
  {
    path: 'src/components/blog/service-highlight.tsx',
    replacements: [
      // Card background
      { from: /className="bg-\[#0A0A0A\] rounded-2xl p-8 border border-\[#2A2A2A\]"/g, to: 'className="bg-white dark:bg-[#0A0A0A] rounded-2xl p-8 border border-gray-200 dark:border-[#2A2A2A]"' },
      
      // Text colors
      { from: /className="text-2xl font-bold text-white mb-2"/g, to: 'className="text-2xl font-bold text-gray-900 dark:text-white mb-2"' },
      { from: /className="text-gray-400"/g, to: 'className="text-gray-600 dark:text-gray-400"' },
    ]
  },
];

console.log('🎨 Starting hardcoded dark color fixes...\n');

let totalFilesUpdated = 0;
let totalReplacements = 0;

files.forEach(fileConfig => {
  const fullPath = path.join(process.cwd(), fileConfig.path);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${fileConfig.path}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  let fileReplacements = 0;
  
  fileConfig.replacements.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      content = content.replace(from, to);
      modified = true;
      fileReplacements += matches.length;
      totalReplacements += matches.length;
    }
  });
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated: ${fileConfig.path} (${fileReplacements} replacements)`);
    totalFilesUpdated++;
  } else {
    console.log(`⏭️  No changes needed: ${fileConfig.path}`);
  }
});

console.log(`\n✨ Hardcoded dark color fixes complete!`);
console.log(`📊 Summary: ${totalFilesUpdated} files updated, ${totalReplacements} total replacements`);

