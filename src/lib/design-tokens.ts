/**
 * Design Tokens for One Human Initiative
 * Minimal editorial aesthetic: Charcoal, Warm White, Stone Grey, Muted Earth Accent
 */

export const colors = {
  // Primary palette
  charcoal: {
    50: '#f5f5f4',
    100: '#e7e5e4',
    200: '#d6d3d1',
    300: '#b8b4b0',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },

  // Warm white / cream
  warmWhite: {
    50: '#fdfcfb',
    100: '#faf8f5',
    200: '#f4f0eb',
    300: '#ebe4dc',
    400: '#e0d8ce',
    500: '#d4c9bc',
  },

  // Stone grey
  stone: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
  },

  // Muted earth accent (terracotta/clay)
  earth: {
    50: '#fdf8f5',
    100: '#faebe1',
    200: '#f5d6c4',
    300: '#ecb899',
    400: '#e0936a',
    500: '#d4754a',
    600: '#c45d36',
    700: '#a3472c',
    800: '#853a28',
    900: '#6e3124',
  },

  // Semantic colors
  success: {
    light: '#dcfce7',
    DEFAULT: '#22c55e',
    dark: '#166534',
  },
  warning: {
    light: '#fef9c3',
    DEFAULT: '#eab308',
    dark: '#854d0e',
  },
  error: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#991b1b',
  },
  info: {
    light: '#dbeafe',
    DEFAULT: '#3b82f6',
    dark: '#1e40af',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Source Serif 4', 'Georgia', 'serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.1',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  },
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  DEFAULT: '0.375rem', // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  DEFAULT: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  toast: 1700,
} as const;

// CSS Custom Properties for runtime theming
export const cssVariables = `
  :root {
    /* Colors */
    --color-charcoal-50: ${colors.charcoal[50]};
    --color-charcoal-100: ${colors.charcoal[100]};
    --color-charcoal-200: ${colors.charcoal[200]};
    --color-charcoal-300: ${colors.charcoal[300]};
    --color-charcoal-400: ${colors.charcoal[400]};
    --color-charcoal-500: ${colors.charcoal[500]};
    --color-charcoal-600: ${colors.charcoal[600]};
    --color-charcoal-700: ${colors.charcoal[700]};
    --color-charcoal-800: ${colors.charcoal[800]};
    --color-charcoal-900: ${colors.charcoal[900]};
    --color-charcoal-950: ${colors.charcoal[950]};

    --color-warm-white-50: ${colors.warmWhite[50]};
    --color-warm-white-100: ${colors.warmWhite[100]};
    --color-warm-white-200: ${colors.warmWhite[200]};
    --color-warm-white-300: ${colors.warmWhite[300]};
    --color-warm-white-400: ${colors.warmWhite[400]};
    --color-warm-white-500: ${colors.warmWhite[500]};

    --color-stone-50: ${colors.stone[50]};
    --color-stone-100: ${colors.stone[100]};
    --color-stone-200: ${colors.stone[200]};
    --color-stone-300: ${colors.stone[300]};
    --color-stone-400: ${colors.stone[400]};
    --color-stone-500: ${colors.stone[500]};
    --color-stone-600: ${colors.stone[600]};
    --color-stone-700: ${colors.stone[700]};
    --color-stone-800: ${colors.stone[800]};
    --color-stone-900: ${colors.stone[900]};

    --color-earth-50: ${colors.earth[50]};
    --color-earth-100: ${colors.earth[100]};
    --color-earth-200: ${colors.earth[200]};
    --color-earth-300: ${colors.earth[300]};
    --color-earth-400: ${colors.earth[400]};
    --color-earth-500: ${colors.earth[500]};
    --color-earth-600: ${colors.earth[600]};
    --color-earth-700: ${colors.earth[700]};
    --color-earth-800: ${colors.earth[800]};
    --color-earth-900: ${colors.earth[900]};

    /* Semantic */
    --color-success: ${colors.success.DEFAULT};
    --color-success-light: ${colors.success.light};
    --color-success-dark: ${colors.success.dark};

    --color-warning: ${colors.warning.DEFAULT};
    --color-warning-light: ${colors.warning.light};
    --color-warning-dark: ${colors.warning.dark};

    --color-error: ${colors.error.DEFAULT};
    --color-error-light: ${colors.error.light};
    --color-error-dark: ${colors.error.dark};

    --color-info: ${colors.info.DEFAULT};
    --color-info-light: ${colors.info.light};
    --color-info-dark: ${colors.info.dark};

    /* Spacing */
    --spacing-0: ${spacing[0]};
    --spacing-1: ${spacing[1]};
    --spacing-2: ${spacing[2]};
    --spacing-3: ${spacing[3]};
    --spacing-4: ${spacing[4]};
    --spacing-5: ${spacing[5]};
    --spacing-6: ${spacing[6]};
    --spacing-8: ${spacing[8]};
    --spacing-10: ${spacing[10]};
    --spacing-12: ${spacing[12]};
    --spacing-16: ${spacing[16]};
    --spacing-20: ${spacing[20]};
    --spacing-24: ${spacing[24]};

    /* Border Radius */
    --radius-none: ${borderRadius.none};
    --radius-sm: ${borderRadius.sm};
    --radius-md: ${borderRadius.md};
    --radius-lg: ${borderRadius.lg};
    --radius-xl: ${borderRadius.xl};
    --radius-2xl: ${borderRadius['2xl']};
    --radius-full: ${borderRadius.full};

    /* Shadows */
    --shadow-sm: ${shadows.sm};
    --shadow-md: ${shadows.md};
    --shadow-lg: ${shadows.lg};
    --shadow-xl: ${shadows.xl};

    /* Transitions */
    --transition-fast: ${transitions.fast};
    --transition-normal: ${transitions.DEFAULT};
    --transition-slow: ${transitions.slow};
  }
`;

// Dark mode variables (optional - can be enabled later)
export const darkModeVariables = `
  @media (prefers-color-scheme: dark) {
    :root {
      --color-bg-primary: ${colors.charcoal[950]};
      --color-bg-secondary: ${colors.charcoal[900]};
      --color-bg-tertiary: ${colors.charcoal[800]};
      --color-text-primary: ${colors.warmWhite[50]};
      --color-text-secondary: ${colors.warmWhite[200]};
      --color-text-muted: ${colors.warmWhite[400]};
      --color-border: ${colors.charcoal[700]};
    }
  }
`;