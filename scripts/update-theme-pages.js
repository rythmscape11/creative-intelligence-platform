const fs = require('fs');
const path = require('path');

// Internal pages to update
const files = [
  'src/app/strategy/page.tsx',
  'src/app/tools/page.tsx',
  'src/app/pricing/page.tsx',
  'src/app/about/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/blog/page.tsx',
  'src/app/blog/[slug]/page.tsx',
  'src/app/services/page.tsx',
  'src/app/demo/page.tsx',
];

// Replacement patterns
const replacements = [
  // Background colors - handle hardcoded dark colors
  { from: /className="([^"]*?)bg-\[#0A0A0A\]([^"]*?)"/g, to: 'className="$1bg-white dark:bg-[#0A0A0A]$2"' },
  { from: /className='([^']*?)bg-\[#0A0A0A\]([^']*?)'/g, to: "className='$1bg-white dark:bg-[#0A0A0A]$2'" },
  { from: /className={`([^`]*?)bg-\[#0A0A0A\]([^`]*?)`}/g, to: 'className={`$1bg-white dark:bg-[#0A0A0A]$2`}' },
  
  { from: /className="([^"]*?)bg-black([^"]*?)"/g, to: 'className="$1bg-white dark:bg-black$2"' },
  { from: /className='([^']*?)bg-black([^']*?)'/g, to: "className='$1bg-white dark:bg-black$2'" },
  { from: /className={`([^`]*?)bg-black([^`]*?)`}/g, to: 'className={`$1bg-white dark:bg-black$2`}' },
  
  // Background colors - theme tokens
  { from: /className="([^"]*?)bg-bg-primary([^"]*?)"/g, to: 'className="$1bg-white dark:bg-bg-primary$2"' },
  { from: /className='([^']*?)bg-bg-primary([^']*?)'/g, to: "className='$1bg-white dark:bg-bg-primary$2'" },
  { from: /className={`([^`]*?)bg-bg-primary([^`]*?)`}/g, to: 'className={`$1bg-white dark:bg-bg-primary$2`}' },
  
  { from: /className="([^"]*?)bg-bg-secondary([^"]*?)"/g, to: 'className="$1bg-gray-50 dark:bg-bg-secondary$2"' },
  { from: /className='([^']*?)bg-bg-secondary([^']*?)'/g, to: "className='$1bg-gray-50 dark:bg-bg-secondary$2'" },
  { from: /className={`([^`]*?)bg-bg-secondary([^`]*?)`}/g, to: 'className={`$1bg-gray-50 dark:bg-bg-secondary$2`}' },
  
  { from: /className="([^"]*?)bg-bg-tertiary([^"]*?)"/g, to: 'className="$1bg-gray-100 dark:bg-bg-tertiary$2"' },
  { from: /className='([^']*?)bg-bg-tertiary([^']*?)'/g, to: "className='$1bg-gray-100 dark:bg-bg-tertiary$2'" },
  { from: /className={`([^`]*?)bg-bg-tertiary([^`]*?)`}/g, to: 'className={`$1bg-gray-100 dark:bg-bg-tertiary$2`}' },
  
  { from: /className="([^"]*?)bg-bg-elevated([^"]*?)"/g, to: 'className="$1bg-gray-100 dark:bg-bg-elevated$2"' },
  { from: /className='([^']*?)bg-bg-elevated([^']*?)'/g, to: "className='$1bg-gray-100 dark:bg-bg-elevated$2'" },
  { from: /className={`([^`]*?)bg-bg-elevated([^`]*?)`}/g, to: 'className={`$1bg-gray-100 dark:bg-bg-elevated$2`}' },
  
  // Text colors
  { from: /className="([^"]*?)text-text-primary([^"]*?)"/g, to: 'className="$1text-gray-900 dark:text-text-primary$2"' },
  { from: /className='([^']*?)text-text-primary([^']*?)'/g, to: "className='$1text-gray-900 dark:text-text-primary$2'" },
  { from: /className={`([^`]*?)text-text-primary([^`]*?)`}/g, to: 'className={`$1text-gray-900 dark:text-text-primary$2`}' },
  
  { from: /className="([^"]*?)text-text-secondary([^"]*?)"/g, to: 'className="$1text-gray-600 dark:text-text-secondary$2"' },
  { from: /className='([^']*?)text-text-secondary([^']*?)'/g, to: "className='$1text-gray-600 dark:text-text-secondary$2'" },
  { from: /className={`([^`]*?)text-text-secondary([^`]*?)`}/g, to: 'className={`$1text-gray-600 dark:text-text-secondary$2`}' },
  
  { from: /className="([^"]*?)text-text-tertiary([^"]*?)"/g, to: 'className="$1text-gray-500 dark:text-text-tertiary$2"' },
  { from: /className='([^']*?)text-text-tertiary([^']*?)'/g, to: "className='$1text-gray-500 dark:text-text-tertiary$2'" },
  { from: /className={`([^`]*?)text-text-tertiary([^`]*?)`}/g, to: 'className={`$1text-gray-500 dark:text-text-tertiary$2`}' },
  
  // Border colors
  { from: /className="([^"]*?)border-border-primary([^"]*?)"/g, to: 'className="$1border-gray-200 dark:border-border-primary$2"' },
  { from: /className='([^']*?)border-border-primary([^']*?)'/g, to: "className='$1border-gray-200 dark:border-border-primary$2'" },
  { from: /className={`([^`]*?)border-border-primary([^`]*?)`}/g, to: 'className={`$1border-gray-200 dark:border-border-primary$2`}' },
];

console.log('🎨 Starting theme updates for internal pages...\n');

files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed: ${filePath}`);
  }
});

console.log('\n✨ Theme updates for internal pages complete!');

