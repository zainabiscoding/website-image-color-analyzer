export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface PaletteColor {
  hex: string;
  rgb: RGB;
  hsl?: HSL;
  proportion?: number;
  role?: 'primary' | 'secondary' | 'background' | 'text' | 'accent' | 'surface' | 'border';
}

export interface Palette {
  id: string;
  name: string;
  sourceType: 'image' | 'website';
  sourceUrl?: string;
  colors: PaletteColor[];
  createdAt: number;
}

export interface GeneratedPalette extends Palette {
  sourcePaletteId: string;
  style: PaletteStyle;
}

export type PaletteStyle =
  | 'warm-soft'
  | 'cool-calm'
  | 'modern-contrast'
  | 'natural-earthy'
  | 'analogous'
  | 'complementary';

export type AnalysisMode = 'image' | 'website';

export interface AnalysisResult {
  palette: Palette;
  success: boolean;
  error?: string;
}

export interface ContrastInfo {
  ratio: number;
  level: 'AAA' | 'AA' | 'AA-large' | 'fail';
  accessible: boolean;
}
