export type SocialPlatform = 'instagram-post' | 'instagram-story' | 'facebook-post' | 'facebook-cover' | 'twitter-post' | 'twitter-header' | 'linkedin-post' | 'linkedin-cover' | 'youtube-thumbnail' | 'pinterest-pin';

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: string;
  platform: string;
  type: string;
}

export interface ResizedImageResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  requiresCropping: boolean;
}

interface ResizeImageOptions {
  file: File;
  targetWidth: number;
  targetHeight: number;
  mode?: 'cover' | 'contain';
  mimeType?: string;
  quality?: number;
}

export const IMAGE_PRESETS: Record<SocialPlatform, ImageDimensions> = {
  'instagram-post': {
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    platform: 'Instagram',
    type: 'Post (Square)'
  },
  'instagram-story': {
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    platform: 'Instagram',
    type: 'Story'
  },
  'facebook-post': {
    width: 1200,
    height: 630,
    aspectRatio: '1.91:1',
    platform: 'Facebook',
    type: 'Post'
  },
  'facebook-cover': {
    width: 820,
    height: 312,
    aspectRatio: '2.63:1',
    platform: 'Facebook',
    type: 'Cover Photo'
  },
  'twitter-post': {
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    platform: 'Twitter',
    type: 'Post'
  },
  'twitter-header': {
    width: 1500,
    height: 500,
    aspectRatio: '3:1',
    platform: 'Twitter',
    type: 'Header'
  },
  'linkedin-post': {
    width: 1200,
    height: 627,
    aspectRatio: '1.91:1',
    platform: 'LinkedIn',
    type: 'Post'
  },
  'linkedin-cover': {
    width: 1584,
    height: 396,
    aspectRatio: '4:1',
    platform: 'LinkedIn',
    type: 'Cover Photo'
  },
  'youtube-thumbnail': {
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    platform: 'YouTube',
    type: 'Thumbnail'
  },
  'pinterest-pin': {
    width: 1000,
    height: 1500,
    aspectRatio: '2:3',
    platform: 'Pinterest',
    type: 'Pin'
  }
};

export function getImagePreset(platform: SocialPlatform): ImageDimensions {
  return IMAGE_PRESETS[platform];
}

export function getAllPresets(): ImageDimensions[] {
  return Object.values(IMAGE_PRESETS);
}

export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

export function resizeImage(
  originalWidth: number,
  originalHeight: number,
  targetWidth: number,
  targetHeight: number,
  maintainAspectRatio: boolean = true
): { width: number; height: number; cropNeeded: boolean } {
  if (!maintainAspectRatio) {
    return { width: targetWidth, height: targetHeight, cropNeeded: false };
  }

  const originalRatio = originalWidth / originalHeight;
  const targetRatio = targetWidth / targetHeight;

  let newWidth: number;
  let newHeight: number;
  let cropNeeded = false;

  if (originalRatio > targetRatio) {
    // Original is wider
    newHeight = targetHeight;
    newWidth = Math.round(targetHeight * originalRatio);
    cropNeeded = true;
  } else if (originalRatio < targetRatio) {
    // Original is taller
    newWidth = targetWidth;
    newHeight = Math.round(targetWidth / originalRatio);
    cropNeeded = true;
  } else {
    // Same aspect ratio
    newWidth = targetWidth;
    newHeight = targetHeight;
  }

  return { width: newWidth, height: newHeight, cropNeeded };
}

// Browser-based resize helper powers the new upload workflow so the tool is no longer a static size chart.
export async function resizeImageFile({
  file,
  targetWidth,
  targetHeight,
  mode = 'cover',
  mimeType = 'image/png',
  quality = 0.92
}: ResizeImageOptions): Promise<ResizedImageResult> {
  if (typeof window === 'undefined') {
    throw new Error('Image resizing is only available in the browser.');
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Unable to access drawing context.');
    }

    const sourceRatio = image.width / image.height;
    const targetRatio = targetWidth / targetHeight;

    let sx = 0;
    let sy = 0;
    let sWidth = image.width;
    let sHeight = image.height;
    let requiresCropping = false;

    if (mode === 'cover') {
      if (sourceRatio > targetRatio) {
        sHeight = image.height;
        sWidth = targetRatio * sHeight;
        sx = (image.width - sWidth) / 2;
      } else {
        sWidth = image.width;
        sHeight = sWidth / targetRatio;
        sy = (image.height - sHeight) / 2;
      }
      requiresCropping = sWidth !== image.width || sHeight !== image.height;
    } else {
      // Stretch to fit (contain) without cropping.
      requiresCropping = false;
    }

    context.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Failed to resize image.'));
        }
      }, mimeType, quality);
    });

    return {
      blob,
      url: URL.createObjectURL(blob),
      width: targetWidth,
      height: targetHeight,
      requiresCropping
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load image.'));
    image.src = src;
  });
}
