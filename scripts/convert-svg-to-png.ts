/**
 * Convert SVG logos to PNG format for better compatibility
 * Uses sharp library for high-quality conversion
 */

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

async function convertSvgToPng() {
  const logosDir = path.join(process.cwd(), 'public', 'images', 'logos');
  
  console.log('🎨 Converting SVG logos to PNG format...\n');
  
  // Convert icon logo to multiple sizes
  const iconSvg = await fs.readFile(path.join(logosDir, 'mediaplanpro-premium-icon.svg'));
  
  // 1024x1024 - High resolution
  await sharp(iconSvg)
    .resize(1024, 1024)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(logosDir, 'mediaplanpro-premium-icon-1024.png'));
  console.log('✅ Created: mediaplanpro-premium-icon-1024.png (1024x1024)');
  
  // 512x512 - Standard app icon
  await sharp(iconSvg)
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(logosDir, 'mediaplanpro-premium-icon-512.png'));
  console.log('✅ Created: mediaplanpro-premium-icon-512.png (512x512)');
  
  // 192x192 - PWA icon
  await sharp(iconSvg)
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(logosDir, 'mediaplanpro-premium-icon-192.png'));
  console.log('✅ Created: mediaplanpro-premium-icon-192.png (192x192)');
  
  // 64x64 - Small icon
  await sharp(iconSvg)
    .resize(64, 64)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(logosDir, 'mediaplanpro-premium-icon-64.png'));
  console.log('✅ Created: mediaplanpro-premium-icon-64.png (64x64)');
  
  // 32x32 - Favicon size
  await sharp(iconSvg)
    .resize(32, 32)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(logosDir, 'mediaplanpro-premium-icon-32.png'));
  console.log('✅ Created: mediaplanpro-premium-icon-32.png (32x32)');
  
  // Convert horizontal logo
  const horizontalSvg = await fs.readFile(path.join(logosDir, 'mediaplanpro-premium-horizontal.svg'));
  
  await sharp(horizontalSvg)
    .resize(1792, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(logosDir, 'mediaplanpro-premium-horizontal.png'));
  console.log('✅ Created: mediaplanpro-premium-horizontal.png (1792x512)');
  
  console.log('\n🎉 All PNG logos created successfully!');
}

convertSvgToPng().catch((err) => {
  console.error('❌ Conversion failed:', err);
  console.log('\n💡 Make sure sharp is installed: npm install sharp');
  process.exit(1);
});

