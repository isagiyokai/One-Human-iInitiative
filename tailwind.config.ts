const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
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
          900: '#1c1917',  // Main charcoal
          950: '#0c0a09',
        },
        warmwhite: {
          50: '#fdfdfb',
          100: '#fafaf7',
          200: '#f5f5f0',
          300: '#ededdf',
          400: '#e3e3ca',
          500: '#d6d6b8',
          600: '#bdbd94',
          700: '#959570',
          800: '#76765a',
          900: '#5f5f4a',
        },
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
          950: '#0c0a09',
        },
        // Earth accent - adjusted for WCAG AA contrast with white text
        // earth-600 is now dark enough for 4.5:1 on white
        // earth-700 for hover, earth-800 for active
        earth: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad5ac',
          300: '#f7b97a',
          400: '#f4964a',
          500: '#d97706',  // Amber-600 equivalent - passes 4.5:1 with white
          600: '#b45309',  // Amber-700 equivalent - passes 4.5:1 with white
          700: '#92400e',  // Amber-800 equivalent
          800: '#78350f',  // Amber-900 equivalent
          900: '#4c1d0a',
          950: '#2e1005',
        },
        // Semantic aliases for easier usage
        // Primary actions use earth-600 (white text passes)
        // Primary hover uses earth-700
        // Primary active uses earth-800
        // Focus ring uses earth-700 (3:1 on light backgrounds)
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',  // Use for text on emerald-50/100 AND for badge bg with white text
          800: '#065f46',
          900: '#064e3b',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',  // Use for text on amber-50/100 AND for badge bg with white text
          800: '#92400e',
          900: '#78350f',
        },
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',  // Use for text on red-50/100 AND for badge bg with white text
          800: '#991b1b',
          900: '#7f1d1d',
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',  // Use for text on blue-50/100 AND for badge bg with white text
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Semantic color aliases for components
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad5ac',
          300: '#f7b97a',
          400: '#f4964a',
          500: '#d97706',
          600: '#b45309',  // Main primary - white text passes 4.5:1
          700: '#92400e',  // Hover
          800: '#78350f',  // Active
          900: '#4c1d0a',
        },
        // For borders and dividers - darker values for 3:1 UI contrast
        // DEFAULT border uses stone-500 for 3:1 on warm-white
        // light border for subtle dividers (may not meet 3:1 - use with caution)
        border: {
          light: '#d6d3d1',     // stone-300 - for subtle borders (decorative only)
          DEFAULT: '#78716c',   // stone-500 - for default borders (3:1 on warm-white)
          dark: '#57534e',      // stone-600 - for emphasized borders
          focus: '#92400e',     // earth-700 - for focus rings (3:1 on light backgrounds)
        },
        // For placeholder text - meets 4.5:1 on light backgrounds
        placeholder: {
          DEFAULT: '#78716c',   // stone-500 - 4.5:1 on warm-white, 4.4:1 on stone-100 (close)
          light: '#a8a29e',     // stone-400 - for less prominent placeholders
        },
        // Badge backgrounds with white text - using 700 for 4.5:1 contrast
        badge: {
          success: '#047857',   // emerald-700
          warning: '#b45309',   // amber-700
          error: '#b91c1c',     // red-700
          info: '#1d4ed8',      // blue-700
          neutral: '#1c1917',   // charcoal-900
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.5rem, 4vw, 2.25rem)', { lineHeight: '1.25' }],
        'heading-xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.35' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        'soft': '0 2px 8px -2px rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'medium': '0 4px 16px -4px rgb(0 0 0 / 0.08), 0 2px 6px -2px rgb(0 0 0 / 0.04)',
        'strong': '0 8px 32px -8px rgb(0 0 0 / 0.1), 0 4px 12px -4px rgb(0 0 0 / 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};

export default config;