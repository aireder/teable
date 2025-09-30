/**
 * Color utilities - simplified from @teable/core
 */

export class Colors {
  static readonly Amber = '#F59E0B';
  static readonly Blue = '#3B82F6';
  static readonly Cyan = '#06B6D4';
  static readonly Emerald = '#10B981';
  static readonly Fuchsia = '#D946EF';
  static readonly Gray = '#6B7280';
  static readonly Green = '#22C55E';
  static readonly Indigo = '#6366F1';
  static readonly Lime = '#84CC16';
  static readonly Orange = '#F97316';
  static readonly Pink = '#EC4899';
  static readonly Purple = '#A855F7';
  static readonly Red = '#EF4444';
  static readonly Rose = '#F43F5E';
  static readonly Sky = '#0EA5E9';
  static readonly Slate = '#64748B';
  static readonly Teal = '#14B8A6';
  static readonly Violet = '#8B5CF6';
  static readonly Yellow = '#EAB308';
  static readonly Zinc = '#71717A';
}

export class ColorUtils {
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  static rgbToHex(r: number, g: number, b: number): string {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  static getContrastYIQ(hexColor: string): 'black' | 'white' {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return 'black';
    const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  }
}

/**
 * Get contrast color for theme mode
 */
export function contractColorForTheme(color: string, theme: 'light' | 'dark' = 'light'): string {
  if (theme === 'dark') {
    // Lighten color for dark theme
    const rgb = ColorUtils.hexToRgb(color);
    if (!rgb) return color;
    const factor = 1.3;
    return ColorUtils.rgbToHex(
      Math.min(255, Math.round(rgb.r * factor)),
      Math.min(255, Math.round(rgb.g * factor)),
      Math.min(255, Math.round(rgb.b * factor))
    );
  }
  return color;
}