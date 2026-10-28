import { PaletteColor } from '../types';
import { rgbToHex, rgbToHsl, hexToRgb } from './colorUtils';
import { v4 as uuidv4 } from 'uuid';
import { Palette } from '../types';

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

async function fetchWithProxy(url: string): Promise<string> {
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(`${proxy}${encodeURIComponent(url)}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (response.ok) {
        return await response.text();
      }
    } catch {
      continue;
    }
  }
  throw new Error('Unable to access the website. It may be blocking automated access or the URL may be invalid.');
}

function extractColorsFromCSS(css: string): string[] {
  const colors: Set<string> = new Set();
  
  const hexPattern = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
  let match;
  while ((match = hexPattern.exec(css)) !== null) {
    const hex = match[1];
    if (hex.length === 3) {
      const expanded = hex.split('').map(c => c + c).join('');
      colors.add(`#${expanded}`.toUpperCase());
    } else {
      colors.add(`#${hex}`.toUpperCase());
    }
  }

  const rgbPattern = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/g;
  while ((match = rgbPattern.exec(css)) !== null) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    if (r <= 255 && g <= 255 && b <= 255) {
      colors.add(rgbToHex({ r, g, b }));
    }
  }

  const hslPattern = /hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%/g;
  while ((match = hslPattern.exec(css)) !== null) {
    const h = parseInt(match[1]) % 360;
    const s = parseInt(match[2]);
    const l = parseInt(match[3]);
    if (s <= 100 && l <= 100) {
      const rgbStr = `hsl(${h}, ${s}%, ${l}%)`;
      const tempEl = document.createElement('div');
      tempEl.style.color = rgbStr;
      document.body.appendChild(tempEl);
      const computed = getComputedStyle(tempEl).color;
      document.body.removeChild(tempEl);
      const rgbMatch = computed.match(/(\d+)/g);
      if (rgbMatch && rgbMatch.length >= 3) {
        colors.add(rgbToHex({
          r: parseInt(rgbMatch[0]),
          g: parseInt(rgbMatch[1]),
          b: parseInt(rgbMatch[2]),
        }));
      }
    }
  }

  return Array.from(colors);
}

function extractColorsFromHTML(html: string): string[] {
  const colors: Set<string> = new Set();
  
  const stylePattern = /style=["'][^"']*?#[0-9a-fA-F]{3,8}[^"']*?["']/gi;
  let match;
  while ((match = stylePattern.exec(html)) !== null) {
    const styleStr = match[0];
    const hexPattern = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
    let hexMatch;
    while ((hexMatch = hexPattern.exec(styleStr)) !== null) {
      const hex = hexMatch[1];
      if (hex.length === 3) {
        const expanded = hex.split('').map(c => c + c).join('');
        colors.add(`#${expanded}`.toUpperCase());
      } else {
        colors.add(`#${hex}`.toUpperCase());
      }
    }
  }

  return Array.from(colors);
}

function filterAndRankColors(hexColors: string[]): PaletteColor[] {
  const validColors = hexColors.filter((hex) => {
    const rgb = hexToRgb(hex);
    const isWhite = rgb.r > 245 && rgb.g > 245 && rgb.b > 245;
    const isBlack = rgb.r < 10 && rgb.g < 10 && rgb.b < 10;
    return !isWhite && !isBlack;
  });

  const colorCounts = new Map<string, number>();
  validColors.forEach((hex) => {
    colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
  });

  const uniqueColors = Array.from(colorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const roles: PaletteColor['role'][] = ['primary', 'secondary', 'accent', 'background', 'text', 'surface', 'border', 'accent'];

  return uniqueColors.map(([hex, count], index) => {
    const rgb = hexToRgb(hex);
    return {
      hex,
      rgb,
      hsl: rgbToHsl(rgb),
      proportion: Math.round((count / validColors.length) * 100),
      role: roles[index % roles.length],
    };
  });
}

export async function analyzeWebsite(url: string): Promise<Palette> {
  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  try {
    new URL(normalizedUrl);
  } catch {
    throw new Error('Please enter a valid website URL.');
  }

  const urlObj = new URL(normalizedUrl);
  const hostname = urlObj.hostname;
  
  if (
    hostname === 'localhost' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.') ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0'
  ) {
    throw new Error('Analysis of private/internal network addresses is not allowed for security reasons.');
  }

  const html = await fetchWithProxy(normalizedUrl);
  
  const cssColors = extractColorsFromCSS(html);
  const htmlColors = extractColorsFromHTML(html);
  const allColors = [...cssColors, ...htmlColors];

  if (allColors.length === 0) {
    throw new Error('No colors could be extracted from this website. The site may use dynamic content loading.');
  }

  const paletteColors = filterAndRankColors(allColors);

  if (paletteColors.length === 0) {
    throw new Error('Could not find meaningful colors in the website. Try a different website.');
  }

  return {
    id: uuidv4(),
    name: urlObj.hostname,
    sourceType: 'website',
    sourceUrl: normalizedUrl,
    colors: paletteColors,
    createdAt: Date.now(),
  };
}

export function validateUrl(url: string): { valid: boolean; error?: string } {
  const trimmed = url.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please enter a website URL.' };
  }

  try {
    let testUrl = trimmed;
    if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
      testUrl = 'https://' + testUrl;
    }
    const urlObj = new URL(testUrl);
    
    if (!urlObj.hostname.includes('.')) {
      return { valid: false, error: 'Please enter a valid domain name.' };
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: 'Please enter a valid website URL.' };
  }
}
