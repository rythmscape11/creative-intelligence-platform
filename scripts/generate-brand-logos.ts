/*
 * Generate MediaPlanPro Brand Logos using OpenAI Images API (DALL·E / gpt-image-1)
 * - Icon Logo (1024x1024, transparent background PNG)
 * - Horizontal Logo (1792x1024, transparent background PNG)
 *
 * Requirements:
 * - Set OPENAI_API_KEY in your environment (e.g., .env.local)
 * - `npm i openai` should already be in dependencies
 */

import 'openai/shims/node';
import OpenAI from 'openai';
import fs from 'node:fs/promises';
import path from 'node:path';

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

function b64ToBuffer(b64: string) {
  return Buffer.from(b64, 'base64');
}

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY is not set. Please add it to your environment (.env.local) and retry.');
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), 'public', 'images', 'logos');
  await ensureDir(outDir);

  const client = new OpenAI({ apiKey });

  console.log('🎨 Generating AI brand logos for MediaPlanPro...');

  // 1) Icon Logo (Square)
  const iconPrompt = `Create a premium, minimalist app icon for a marketing SaaS named "MediaPlanPro".
  Composition:
  - MP monogram in bold, modern geometric letterforms (no serif), white/light gray ink with subtle depth.
  - Rounded square background with premium amber/gold gradient (#F59E0B → #FCD34D), gentle gloss highlight.
  - Subtle soft shadow for depth; 2025 design trends; tech/professional.
  - Clean, legible at small sizes (favicon/mobile).
  - No extra text; centered composition; high-end feel conveying strategy, analytics, growth.
  - Dark theme friendly (should pop on #0A0A0A).
  `;

  // 2) Horizontal Logo (Wide)
  const horizontalPrompt = `Design a horizontal brand logo for "MediaPlanPro".
  Composition:
  - Left: the same MP icon (premium amber gradient background + white monogram), scaled for header.
  - Right: wordmark "MediaPlanPro" in clean, bold sans‑serif (modern tech look), excellent legibility.
  - Balanced spacing between icon and text; refined kerning; no slogan.
  - Subtle depth/shadow consistent with the icon; suitable for dark backgrounds (#0A0A0A).
  - Crisp, professional, corporate aesthetic; conveys strategy, analytics, growth.
  `;

  // Generate Icon (1024x1024)
  console.log('→ Generating icon (1024x1024, transparent)...');
  const iconRes = await client.images.generate({
    model: 'gpt-image-1',
    prompt: iconPrompt,
    size: '1024x1024',
    background: 'transparent',
    quality: 'high',
    n: 1,
    response_format: 'b64_json',
  });

  const iconB64 = iconRes.data?.[0]?.b64_json;
  if (!iconB64) throw new Error('No image data returned for icon');
  const iconPath = path.join(outDir, 'mediaplanpro-ai-icon.png');
  await fs.writeFile(iconPath, b64ToBuffer(iconB64));
  console.log(`✅ Icon saved: ${iconPath}`);

  // Generate Horizontal (1792x1024)
  console.log('→ Generating horizontal logo (1792x1024, transparent)...');
  const horizontalRes = await client.images.generate({
    model: 'gpt-image-1',
    prompt: horizontalPrompt,
    size: '1792x1024',
    background: 'transparent',
    quality: 'high',
    n: 1,
    response_format: 'b64_json',
  });

  const horizontalB64 = horizontalRes.data?.[0]?.b64_json;
  if (!horizontalB64) throw new Error('No image data returned for horizontal logo');
  const horizontalPath = path.join(outDir, 'mediaplanpro-ai-horizontal.png');
  await fs.writeFile(horizontalPath, b64ToBuffer(horizontalB64));
  console.log(`✅ Horizontal logo saved: ${horizontalPath}`);

  console.log('\n🎉 Done. Update components to use:\n  - /images/logos/mediaplanpro-ai-icon.png\n  - /images/logos/mediaplanpro-ai-horizontal.png');
}

main().catch((err) => {
  console.error('❌ Generation failed:', err);
  process.exit(1);
});

