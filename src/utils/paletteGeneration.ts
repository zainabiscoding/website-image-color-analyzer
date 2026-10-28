import { PaletteColor, GeneratedPalette, PaletteStyle } from '../types';
import { hexToHsl, hslToRgb, rgbToHex } from './colorUtils';
import { v4 as uuidv4 } from 'uuid';

function generateWarmSoft(colors: PaletteColor[]): PaletteColor[] {
  return colors.map((c) => {
    const hsl = hexToHsl(c.hex);
    const newHsl = {
      h: (hsl.h + 15) % 360,
      s: Math.max(20, Math.min(80, Math.round(hsl.s * 0.8))),
      l: Math.max(25, Math.min(85, hsl.l + 5)),
    };
    const rgb = hslToRgb(newHsl);
    return {
      hex: rgbToHex(rgb),
      rgb,
      hsl: newHsl,
      proportion: c.proportion,
      role: c.role,
    };
  });
}

function generateCoolCalm(colors: PaletteColor[]): PaletteColor[] {
  return colors.map((c) => {
    const hsl = hexToHsl(c.hex);
    let newH = hsl.h;
    if (newH > 30 && newH < 180) {
      newH = (newH + 200) % 360;
    }
    const newHsl = {
      h: newH,
      s: Math.max(15, Math.min(70, Math.round(hsl.s * 0.75))),
      l: Math.max(30, Math.min(80, hsl.l + 3)),
    };
    const rgb = hslToRgb(newHsl);
    return {
      hex: rgbToHex(rgb),
      rgb,
      hsl: newHsl,
      proportion: c.proportion,
      role: c.role,
    };
  });
}

function generateModernContrast(colors: PaletteColor[]): PaletteColor[] {
  return colors.map((c, i) => {
    const hsl = hexToHsl(c.hex);
    const newHsl = {
      h: hsl.h,
      s: Math.min(100, Math.round(hsl.s * 1.3)),
      l: i % 2 === 0 ? Math.max(10, hsl.l - 20) : Math.min(90, hsl.l + 15),
    };
    const rgb = hslToRgb(newHsl);
    return {
      hex: rgbToHex(rgb),
      rgb,
      hsl: newHsl,
      proportion: c.proportion,
      role: c.role,
    };
  });
}

function generateNaturalEarthy(colors: PaletteColor[]): PaletteColor[] {
  return colors.map((c) => {
    const hsl = hexToHsl(c.hex);
    const newHsl = {
      h: hsl.h >= 20 && hsl.h <= 80 ? hsl.h : (hsl.h * 0.3 + 30) % 360,
      s: Math.max(15, Math.min(55, Math.round(hsl.s * 0.6))),
      l: Math.max(25, Math.min(75, hsl.l)),
    };
    const rgb = hslToRgb(newHsl);
    return {
      hex: rgbToHex(rgb),
      rgb,
      hsl: newHsl,
      proportion: c.proportion,
      role: c.role,
    };
  });
}

function generateAnalogous(colors: PaletteColor[]): PaletteColor[] {
  return colors.map((c) => {
    const hsl = hexToHsl(c.hex);
    const newHsl = {
      h: (hsl.h + 30) % 360,
      s: hsl.s,
      l: hsl.l,
    };
    const rgb = hslToRgb(newHsl);
    return {
      hex: rgbToHex(rgb),
      rgb,
      hsl: newHsl,
      proportion: c.proportion,
      role: c.role,
    };
  });
}

function generateComplementary(colors: PaletteColor[]): PaletteColor[] {
  return colors.map((c) => {
    const hsl = hexToHsl(c.hex);
    const newHsl = {
      h: (hsl.h + 180) % 360,
      s: Math.min(100, Math.round(hsl.s * 0.9)),
      l: hsl.l,
    };
    const rgb = hslToRgb(newHsl);
    return {
      hex: rgbToHex(rgb),
      rgb,
      hsl: newHsl,
      proportion: c.proportion,
      role: c.role,
    };
  });
}

const generators: Record<PaletteStyle, (colors: PaletteColor[]) => PaletteColor[]> = {
  'warm-soft': generateWarmSoft,
  'cool-calm': generateCoolCalm,
  'modern-contrast': generateModernContrast,
  'natural-earthy': generateNaturalEarthy,
  'analogous': generateAnalogous,
  'complementary': generateComplementary,
};

export const paletteStyleLabels: Record<PaletteStyle, string> = {
  'warm-soft': 'Warm & Soft',
  'cool-calm': 'Cool & Calm',
  'modern-contrast': 'Modern & High Contrast',
  'natural-earthy': 'Natural & Earthy',
  'analogous': 'Analogous',
  'complementary': 'Complementary',
};

export const paletteStyleDescriptions: Record<PaletteStyle, string> = {
  'warm-soft': 'Inviting tones with reduced saturation for a gentle feel',
  'cool-calm': 'Serene blues and greens for a peaceful atmosphere',
  'modern-contrast': 'Bold differences between light and dark for impact',
  'natural-earthy': 'Muted, organic tones inspired by nature',
  'analogous': 'Colors adjacent on the color wheel for harmony',
  'complementary': 'Opposite colors for dynamic visual tension',
};

export function generateAllPalettes(
  sourceColors: PaletteColor[],
  sourcePaletteId: string,
  sourceType: 'image' | 'website'
): GeneratedPalette[] {
  return (Object.keys(generators) as PaletteStyle[]).map((style) => {
    const colors = generators[style](sourceColors);
    return {
      id: uuidv4(),
      name: paletteStyleLabels[style],
      sourceType,
      colors,
      createdAt: Date.now(),
      sourcePaletteId,
      style,
    };
  });
}
