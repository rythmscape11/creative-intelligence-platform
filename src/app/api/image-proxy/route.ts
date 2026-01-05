import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const width = parseInt(searchParams.get('w') || '800');
    const quality = parseInt(searchParams.get('q') || '80');
    const format = searchParams.get('f') || 'webp';

    if (!imageUrl) {
      return new NextResponse('Missing image URL', { status: 400 });
    }

    // Validate format
    const allowedFormats = ['webp', 'avif', 'jpeg', 'png'];
    if (!allowedFormats.includes(format)) {
      return new NextResponse('Invalid format', { status: 400 });
    }

    // Validate dimensions
    if (width < 16 || width > 3840) {
      return new NextResponse('Invalid width', { status: 400 });
    }

    // Validate quality
    if (quality < 1 || quality > 100) {
      return new NextResponse('Invalid quality', { status: 400 });
    }

    // Check if it's an external URL or internal path
    let imageBuffer: Buffer;
    
    if (imageUrl.startsWith('http')) {
      // External image - fetch it
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        return new NextResponse('Failed to fetch image', { status: 404 });
      }
      imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    } else {
      // Internal image - this would typically read from your storage
      // For now, return an error for internal images
      return new NextResponse('Internal images not supported in this demo', { status: 400 });
    }

    // Process image with Sharp
    let sharpInstance = sharp(imageBuffer);

    // Get image metadata
    const metadata = await sharpInstance.metadata();
    
    // Calculate height maintaining aspect ratio
    const aspectRatio = metadata.height! / metadata.width!;
    const height = Math.round(width * aspectRatio);

    // Resize image
    sharpInstance = sharpInstance.resize(width, height, {
      fit: 'cover',
      position: 'center',
    });

    // Apply format and quality
    switch (format) {
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality });
        break;
      case 'avif':
        sharpInstance = sharpInstance.avif({ quality });
        break;
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ 
          quality,
          compressionLevel: 9,
        });
        break;
    }

    const optimizedImageBuffer = await sharpInstance.toBuffer();

    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', `image/${format}`);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('Content-Length', optimizedImageBuffer.length.toString());
    
    // Add performance headers
    headers.set('X-Image-Width', width.toString());
    headers.set('X-Image-Height', height.toString());
    headers.set('X-Image-Format', format);
    headers.set('X-Image-Quality', quality.toString());
    headers.set('X-Original-Size', imageBuffer.length.toString());
    headers.set('X-Optimized-Size', optimizedImageBuffer.length.toString());
    headers.set('X-Compression-Ratio', 
      ((1 - optimizedImageBuffer.length / imageBuffer.length) * 100).toFixed(2)
    );

    return new NextResponse(optimizedImageBuffer as unknown as BodyInit, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Image optimization error:', error);
    
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to optimize image',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
