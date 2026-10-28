import { PaletteColor, RGB } from '../types';
import { rgbToHex, rgbToHsl, colorDistance } from './colorUtils';

interface ColorBucket {
  color: RGB;
  count: number;
}

function getImageData(image: HTMLImageElement, maxPixels: number = 50000): ImageData {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  let width = image.naturalWidth;
  let height = image.naturalHeight;

  const totalPixels = width * height;
  if (totalPixels > maxPixels) {
    const scale = Math.sqrt(maxPixels / totalPixels);
    width = Math.floor(width * scale);
    height = Math.floor(height * scale);
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

function quantizeColor(rgb: RGB, factor: number = 32): RGB {
  return {
    r: Math.round(rgb.r / factor) * factor,
    g: Math.round(rgb.g / factor) * factor,
    b: Math.round(rgb.b / factor) * factor,
  };
}

function isNearWhite(rgb: RGB): boolean {
  return rgb.r > 250 && rgb.g > 250 && rgb.b > 250;
}

function isNearBlack(rgb: RGB): boolean {
  return rgb.r < 10 && rgb.g < 10 && rgb.b < 10;
}

function isLightBackground(rgb: RGB): boolean {
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.85;
}

function isGray(rgb: RGB): boolean {
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  return (max - min) < 20;
}

export function extractColorsFromImage(image: HTMLImageElement, numColors: number = 8): PaletteColor[] {
  const imageData = getImageData(image);
  const data = imageData.data;
  const buckets: Map<string, ColorBucket> = new Map();
  const allBuckets: Map<string, ColorBucket> = new Map();

  // First pass: collect ALL colors including light backgrounds
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) continue;

    const rgb: RGB = { r, g, b };

    // Only skip pure white/black
    if (isNearWhite(rgb) || isNearBlack(rgb)) continue;

    const quantized = quantizeColor(rgb, 16); // Finer quantization for backgrounds
    const key = `${quantized.r},${quantized.g},${quantized.b}`;

    const existing = allBuckets.get(key);
    if (existing) {
      existing.count++;
    } else {
      allBuckets.set(key, { color: quantized, count: 1 });
    }
  }

  // Find the most common color (likely background)
  const sortedAll = Array.from(allBuckets.values()).sort((a, b) => b.count - a.count);
  const dominantColor = sortedAll[0];
  const isDominantLight = dominantColor && isLightBackground(dominantColor.color);

  // Second pass: collect accent colors (excluding the dominant if it's light)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) continue;

    const rgb: RGB = { r, g, b };

    if (isNearWhite(rgb) || isNearBlack(rgb)) continue;

    // Skip dominant light background color for accent extraction
    if (isDominantLight && dominantColor) {
      const dist = colorDistance(rgb, dominantColor.color);
      if (dist < 30) continue;
    }

    const quantized = quantizeColor(rgb);
    const key = `${quantized.r},${quantized.g},${quantized.b}`;

    const existing = buckets.get(key);
    if (existing) {
      existing.count++;
    } else {
      buckets.set(key, { color: quantized, count: 1 });
    }
  }

  let sortedBuckets = Array.from(buckets.values())
    .filter((b) => !isGray(b.color) || b.count > 30)
    .sort((a, b) => b.count - a.count);

  const result: ColorBucket[] = [];
  const threshold = 40;

  for (const bucket of sortedBuckets) {
    if (result.length >= numColors * 2) break;

    const isDuplicate = result.some(
      (existing) => colorDistance(existing.color, bucket.color) < threshold
    );

    if (!isDuplicate) {
      result.push(bucket);
    }
  }

  // Build final palette
  const totalCount = result.reduce((sum, b) => sum + b.count, 0) + (dominantColor?.count || 0);

  const paletteColors: PaletteColor[] = [];

  // Add background first if it's light
  if (isDominantLight && dominantColor) {
    const hex = rgbToHex(dominantColor.color);
    paletteColors.push({
      hex,
      rgb: dominantColor.color,
      hsl: rgbToHsl(dominantColor.color),
      proportion: Math.round((dominantColor.count / totalCount) * 100),
      role: 'background',
    });
  }

  // Add accent colors
  const roles: PaletteColor['role'][] = ['primary', 'secondary', 'accent', 'text', 'surface', 'border'];
  result.slice(0, numColors - (isDominantLight ? 1 : 0)).forEach((bucket, index) => {
    const hex = rgbToHex(bucket.color);
    paletteColors.push({
      hex,
      rgb: bucket.color,
      hsl: rgbToHsl(bucket.color),
      proportion: Math.round((bucket.count / totalCount) * 100),
      role: roles[index % roles.length],
    });
  });

  return paletteColors;
}

export function extractColorsFromImageUrl(url: string): Promise<PaletteColor[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const colors = extractColorsFromImage(img);
        resolve(colors);
      } catch (e) {
        reject(new Error('Failed to extract colors from image'));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image. Make sure the URL is accessible.'));
    };

    img.src = url;
  });
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Unsupported file format. Please upload PNG, JPG, or WebP images.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 10MB limit. Please use a smaller image.' };
  }

  return { valid: true };
}
