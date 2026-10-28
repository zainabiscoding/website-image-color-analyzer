import { Palette, PaletteColor } from '../types';
import { rgbString } from './colorUtils';

export function exportPaletteAsJSON(palette: Palette): string {
  const data = {
    name: palette.name,
    sourceType: palette.sourceType,
    sourceUrl: palette.sourceUrl,
    createdAt: new Date(palette.createdAt).toISOString(),
    colors: palette.colors.map((c) => ({
      hex: c.hex,
      rgb: c.rgb,
      hsl: c.hsl,
      proportion: c.proportion,
      role: c.role,
    })),
  };
  return JSON.stringify(data, null, 2);
}

export function exportPaletteAsCSS(palette: Palette): string {
  const roleMap: Record<string, string> = {
    primary: '--color-primary',
    secondary: '--color-secondary',
    accent: '--color-accent',
    background: '--color-background',
    text: '--color-text',
    surface: '--color-surface',
    border: '--color-border',
  };

  const lines = [':root {'];
  
  palette.colors.forEach((color, index) => {
    const varName = color.role ? roleMap[color.role] : `--color-${index + 1}`;
    lines.push(`  ${varName}: ${color.hex};`);
  });
  
  lines.push('}');
  return lines.join('\n');
}

export function exportPaletteAsTailwind(palette: Palette): string {
  const lines = ['// tailwind.config.js', 'module.exports = {', '  theme: {', '    extend: {', '      colors: {'];
  
  palette.colors.forEach((color, index) => {
    const name = color.role || `color-${index + 1}`;
    lines.push(`        '${name}': '${color.hex}',`);
  });
  
  lines.push('      },');
  lines.push('    },');
  lines.push('  },');
  lines.push('};');
  return lines.join('\n');
}

export function formatPaletteForCopy(palette: Palette): string {
  return palette.colors
    .map((c) => `${c.hex} | ${rgbString(c.rgb)}${c.role ? ` (${c.role})` : ''}`)
    .join('\n');
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    return new Promise((resolve, reject) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textArea);
      }
    });
  }
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
