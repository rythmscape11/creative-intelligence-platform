import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const imageResizerContent = {
  metadata: {
    title: 'Image Resizer - Optimize Images for Social Media | Aureon One',
    description: 'Resize and optimize images for Instagram, Facebook, Twitter, and LinkedIn. Free tool for perfect social media image dimensions.',
    keywords: ['image resizer', 'social media image sizes', 'image optimizer', 'resize images online', 'social media dimensions'],
  },

  hero: {
    title: 'Image Resizer',
    subtitle: 'Optimize Images for Social Media',
    description: 'Resize images to perfect dimensions for every social platform. Ensure your visuals look professional and load fast.',
    primaryCTA: 'Resize Images',
    secondaryCTA: 'View Dimensions',
  },

  quickAnswer: {
    question: 'What are the Best Social Media Image Sizes?',
    answer: 'Optimal image sizes vary by platform: Instagram posts (1080x1080px square, 1080x1350px portrait), Instagram Stories (1080x1920px), Facebook posts (1200x630px), Twitter posts (1200x675px), LinkedIn posts (1200x627px), and profile pictures (400x400px most platforms). Use correct dimensions to avoid cropping and ensure professional appearance across all devices.',
  },

  tableOfContents: [
    { id: 'how-to-use', title: 'How to Resize Images', level: 2 },
    { id: 'benefits', title: 'Benefits of Proper Image Sizing', level: 2 },
    { id: 'platform-sizes', title: 'Image Sizes by Platform', level: 2 },
    { id: 'optimization', title: 'Image Optimization Tips', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related Social Tools', level: 2 },
  ] as TOCItem[],

  howToSteps: [
    { name: 'Upload Image', text: 'Select the image you want to resize from your device.' },
    { name: 'Choose Platform', text: 'Select target platform and content type (Instagram post, Facebook cover, etc.).' },
    { name: 'Auto-Resize', text: 'Image automatically resizes to optimal dimensions for selected platform.' },
    { name: 'Adjust Quality', text: 'Optimize file size while maintaining visual quality.' },
    { name: 'Preview Result', text: 'See how your image will appear on the selected platform.' },
    { name: 'Download', text: 'Download optimized image ready for upload to social media.' },
  ] as HowToStep[],

  faqs: [
    {
      question: 'What are the correct Instagram image sizes?',
      answer: 'Instagram image sizes: Square posts (1080x1080px, 1:1 ratio), Portrait posts (1080x1350px, 4:5 ratio), Landscape posts (1080x566px, 1.91:1 ratio), Stories (1080x1920px, 9:16 ratio), Reels (1080x1920px, 9:16 ratio), Profile picture (320x320px, displays as 110x110px), and IGTV cover (420x654px, 1:1.55 ratio). Instagram compresses images over 1080px width, so use 1080px as maximum width. For best quality, upload images at exact dimensions rather than letting Instagram crop them. Square and portrait formats get most engagement in feed.',
    },
    {
      question: 'What are Facebook image dimensions?',
      answer: 'Facebook image dimensions: Feed posts (1200x630px, 1.91:1 ratio), Stories (1080x1920px, 9:16 ratio), Cover photo (820x312px desktop, 640x360px mobile), Profile picture (180x180px, displays as 170x170px), Event cover (1920x1080px), and Link preview (1200x630px). Facebook compresses images, so upload high-quality originals. Minimum width is 600px for feed posts. For best results, use recommended dimensions exactly. Facebook displays images differently on desktop versus mobile, so test on both. Profile pictures should work as circles (center important elements).',
    },
    {
      question: 'How do I optimize images for faster loading?',
      answer: 'Optimize images by compressing files without quality loss (use tools like TinyPNG, ImageOptim), using appropriate file formats (JPEG for photos, PNG for graphics with transparency, WebP for best compression), resizing to exact platform dimensions (don\'t upload 4000px images for 1080px display), removing metadata (EXIF data adds file size), and keeping file sizes under 1MB for social media. Smaller files load faster, improving user experience and engagement. However, don\'t over-compress—maintain visual quality. Test images on mobile devices to ensure they look good. Balance file size with quality.',
    },
    {
      question: 'What image format should I use for social media?',
      answer: 'Use JPEG for photographs and images with many colors (best compression, smaller file sizes), PNG for graphics, logos, or images needing transparency (larger files but better quality for graphics), and WebP for best compression with quality (not universally supported). Avoid GIF for static images (use for animations only). Most social platforms convert images to JPEG anyway, so JPEG is safest choice. PNG is better for images with text or sharp edges. Save images at high quality (80-90% JPEG quality) for social media. Platforms compress images further, so start with good quality.',
    },
    {
      question: 'Why do my images look blurry on Instagram?',
      answer: 'Images look blurry on Instagram due to uploading wrong dimensions (Instagram resizes and compresses), uploading low-resolution images (under 1080px width), over-compressing before upload (Instagram compresses again), using wrong aspect ratios (Instagram crops awkwardly), or uploading from mobile with poor connection (Instagram reduces quality). Fix by uploading images at exactly 1080px width, using correct aspect ratios (1:1, 4:5, 1.91:1), saving at high quality (90-100%), and uploading via WiFi. Export images specifically for Instagram rather than using originals. Test uploads and adjust export settings if needed.',
    },
    {
      question: 'What are Twitter image sizes?',
      answer: 'Twitter image sizes: In-stream photos (1200x675px, 16:9 ratio), Header photo (1500x500px, 3:1 ratio), and Profile picture (400x400px, displays as 200x200px). Twitter supports up to 5MB for photos. Use 2:1 ratio for single images to avoid cropping. For multiple images, Twitter creates collages with different layouts. Minimum size is 600x335px. Twitter compresses images, so upload high quality. Profile pictures display as circles, so center important elements. GIFs are limited to 15MB. Videos have different size requirements (720x1280px recommended).',
    },
    {
      question: 'How do I create images for LinkedIn?',
      answer: 'LinkedIn image sizes: Feed posts (1200x627px, 1.91:1 ratio), Articles (1200x627px), Company logo (300x300px), Cover photo (1584x396px personal, 1128x191px company), and Profile picture (400x400px). LinkedIn is professional, so use high-quality, professional images. Avoid overly casual or low-quality images. Include text overlays for better engagement (but keep text minimal). LinkedIn compresses images, so start with high quality. Test images on desktop and mobile. Profile pictures should be professional headshots. Cover photos should reflect your professional brand.',
    },
    {
      question: 'Can I use the same image size for all platforms?',
      answer: 'No, each platform has different optimal dimensions. Using one size for all platforms results in awkward cropping, reduced quality, or unprofessional appearance. However, you can create images in common ratios that work across multiple platforms: 1:1 (square) works for Instagram, Facebook, LinkedIn, and Twitter; 16:9 (landscape) works for Twitter, Facebook, and YouTube; 9:16 (vertical) works for Stories across all platforms. Best practice: create platform-specific versions of important images. For casual posts, 1:1 square is most versatile. For campaigns, create optimized versions for each platform.',
    },
    {
      question: 'What is aspect ratio and why does it matter?',
      answer: 'Aspect ratio is the proportional relationship between image width and height (e.g., 16:9, 4:3, 1:1). It matters because platforms display images at specific aspect ratios, cropping images that don\'t match. Wrong aspect ratios result in important elements being cut off, awkward cropping, or reduced visual impact. Common ratios: 1:1 (square), 4:5 (portrait), 16:9 (landscape), 9:16 (vertical/Stories). Design images with aspect ratio in mind, keeping important elements in the "safe zone" that won\'t be cropped. Test how images appear on different devices and platforms before posting.',
    },
    {
      question: 'How do I resize images without losing quality?',
      answer: 'Resize images without quality loss by starting with high-resolution originals (larger than target size), using quality image editing software (Photoshop, GIMP, Canva), maintaining aspect ratio when resizing (avoid stretching), using bicubic interpolation for downscaling, and saving at appropriate quality settings (90-100% for JPEG). Never upscale images (making small images larger)—this always reduces quality. When downsizing, reduce in increments rather than one large reduction. Export at exact platform dimensions. Use lossless formats (PNG) during editing, then convert to JPEG for final upload. Quality starts with good original images.',
    },
    {
      question: 'What are safe zones for social media images?',
      answer: 'Safe zones are areas of images guaranteed to display without cropping across devices. Keep important elements (text, faces, logos) in the center 80% of images. Platforms crop images differently on desktop versus mobile. Instagram feed crops square images to 4:5 on profile grid. Facebook crops link previews differently in feed versus timeline. Profile pictures display as circles, so center important elements. When designing images, use templates showing safe zones. Test images on multiple devices before posting. Avoid placing critical information near edges. Safe zones ensure your message displays properly everywhere.',
    },
    {
      question: 'Should I add text to social media images?',
      answer: 'Yes, images with text overlays get 2-3x more engagement than images alone. Text should be large, readable on mobile (minimum 30pt font), high contrast with background, concise (5-7 words maximum), and positioned in safe zones. However, Facebook reduces reach for images with over 20% text coverage. Keep text minimal and impactful. Use text to reinforce message, not replace caption. Ensure text is readable at small sizes (mobile display). Test readability on actual devices. Some platforms (Instagram Stories) have built-in text tools—use them for native appearance.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      name: 'Social Caption Generator',
      description: 'Create engaging social media captions',
      url: '/tools/content/social-caption-generator-enhanced',
      category: 'Content',
    },
    {
      name: 'Email Signature Generator',
      description: 'Create professional email signatures with images',
      url: '/tools/email/signature-generator-enhanced',
      category: 'Email',
    },
    {
      name: 'Page Speed Analyzer',
      description: 'Test image optimization impact on page speed',
      url: '/tools/seo/page-speed-analyzer-enhanced',
      category: 'SEO',
    },
    {
      name: 'Social Audit Tool',
      description: 'Analyze social media visual performance',
      url: '/tools/social/social-audit-tool-enhanced',
      category: 'Social',
    },
  ] as RelatedTool[],
};

