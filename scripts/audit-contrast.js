#!/usr/bin/env node
/**
 * Contrast Audit Script for WCAG AA Compliance
 *
 * This script checks the color tokens in tailwind.config.ts against WCAG AA requirements:
 * - Normal text: 4.5:1
 * - Large text (18px+ or 14px+ bold): 3:1
 * - UI components (borders, focus indicators): 3:1
 *
 * Run with: node scripts/audit-contrast.js
 */

// sRGB to linear RGB
function srgbToLinear(c) {
  c = c / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// Calculate relative luminance
function getLuminance(r, g, b) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// Parse hex color to RGB
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

// Calculate contrast ratio
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Check if contrast meets WCAG AA
function checkContrast(fg, bg, isLargeText = false, isUI = false) {
  const ratio = getContrastRatio(fg, bg);
  let threshold = 4.5; // Normal text
  if (isLargeText) threshold = 3; // Large text
  if (isUI) threshold = 3; // UI components

  return {
    ratio: ratio.toFixed(2),
    threshold,
    passes: ratio >= threshold,
    level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'FAIL'
  };
}

// Color palette from updated tailwind.config.ts
const colors = {
  // Charcoal scale
  'charcoal-50': '#f5f5f4',
  'charcoal-100': '#e7e5e4',
  'charcoal-200': '#d6d3d1',
  'charcoal-300': '#b8b4b0',
  'charcoal-400': '#a8a29e',
  'charcoal-500': '#78716c',
  'charcoal-600': '#57534e',
  'charcoal-700': '#44403c',
  'charcoal-800': '#292524',
  'charcoal-900': '#1c1917',
  'charcoal-950': '#0c0a09',

  // Stone scale (warm greys)
  'stone-50': '#fafaf9',
  'stone-100': '#f5f5f4',
  'stone-200': '#e7e5e4',
  'stone-300': '#d6d3d1',
  'stone-400': '#a8a29e',
  'stone-500': '#78716c',
  'stone-600': '#57534e',
  'stone-700': '#44403c',
  'stone-800': '#292524',
  'stone-900': '#1c1917',
  'stone-950': '#0c0a09',

  // Warm white
  'warm-white': '#fdfdfb',

  // Earth accent - ADJUSTED FOR WCAG AA
  'earth-50': '#fef7ee',
  'earth-100': '#fdedd6',
  'earth-200': '#fad5ac',
  'earth-300': '#f7b97a',
  'earth-400': '#f4964a',
  'earth-500': '#d97706',  // Amber-600 equivalent
  'earth-600': '#b45309',  // Amber-700 equivalent - MAIN PRIMARY
  'earth-700': '#92400e',  // Amber-800 - HOVER
  'earth-800': '#78350f',  // Amber-900 - ACTIVE
  'earth-900': '#4c1d0a',
  'earth-950': '#2e1005',

  // Status colors
  'emerald-50': '#ecfdf5',
  'emerald-100': '#d1fae5',
  'emerald-500': '#10b981',
  'emerald-600': '#059669',
  'emerald-700': '#047857',  // For text on light emerald backgrounds
  'emerald-800': '#065f46',

  'amber-50': '#fffbeb',
  'amber-100': '#fef3c7',
  'amber-500': '#f59e0b',
  'amber-600': '#d97706',
  'amber-700': '#b45309',    // For text on light amber backgrounds
  'amber-800': '#92400e',

  'red-50': '#fef2f2',
  'red-100': '#fee2e2',
  'red-500': '#ef4444',
  'red-600': '#dc2626',
  'red-700': '#b91c1c',      // For text on light red backgrounds
  'red-800': '#991b1b',

  'blue-50': '#eff6ff',
  'blue-100': '#dbeafe',
  'blue-500': '#3b82f6',
  'blue-600': '#2563eb',
  'blue-700': '#1d4ed8',     // For text on light blue backgrounds
  'blue-800': '#1e40af',

  // Semantic border colors
  'border-light': '#d6d3d1',     // stone-300 - decorative only, may not meet 3:1
  'border-default': '#78716c',   // stone-500 - 3:1 on warm-white
  'border-dark': '#57534e',      // stone-600 - for emphasized borders
  'border-focus': '#92400e',     // earth-700 - 3:1 on light backgrounds

  // Placeholder colors
  'placeholder-default': '#57534e',  // stone-600 - 4.5:1 on warm-white and stone-100
  'placeholder-light': '#78716c',    // stone-500

  // White and black
  'white': '#ffffff',
  'black': '#000000',
};

console.log('=== WCAG AA Contrast Audit (Updated Palette) ===\n');

// Common text/background pairs to check
const pairs = [
  // Body text on backgrounds
  { fg: 'charcoal-900', bg: 'warm-white', name: 'Body text on warm-white', large: false, ui: false },
  { fg: 'charcoal-900', bg: 'stone-50', name: 'Body text on stone-50', large: false, ui: false },
  { fg: 'charcoal-700', bg: 'warm-white', name: 'Secondary text on warm-white', large: false, ui: false },
  { fg: 'charcoal-700', bg: 'stone-50', name: 'Secondary text on stone-50', large: false, ui: false },
  { fg: 'charcoal-600', bg: 'warm-white', name: 'Muted text on warm-white', large: false, ui: false },
  { fg: 'charcoal-600', bg: 'stone-50', name: 'Muted text on stone-50', large: false, ui: false },

  // Headings
  { fg: 'charcoal-900', bg: 'warm-white', name: 'Headings on warm-white', large: true, ui: false },
  { fg: 'charcoal-900', bg: 'stone-50', name: 'Headings on stone-50', large: true, ui: false },

  // Earth accent on light backgrounds (TEXT)
  { fg: 'earth-600', bg: 'warm-white', name: 'Earth-600 (primary text) on warm-white', large: false, ui: false },
  { fg: 'earth-600', bg: 'stone-50', name: 'Earth-600 (primary text) on stone-50', large: false, ui: false },
  { fg: 'earth-700', bg: 'warm-white', name: 'Earth-700 (primary hover text) on warm-white', large: false, ui: false },

  // White on earth accent (BUTTONS)
  { fg: 'white', bg: 'earth-600', name: 'White on earth-600 (button)', large: false, ui: false },
  { fg: 'white', bg: 'earth-700', name: 'White on earth-700 (button hover)', large: false, ui: false },
  { fg: 'white', bg: 'earth-800', name: 'White on earth-800 (button active)', large: false, ui: false },

  // Status colors on light backgrounds - using 700 for text on 50/100
  { fg: 'emerald-700', bg: 'emerald-50', name: 'Success text on success bg', large: false, ui: false },
  { fg: 'emerald-700', bg: 'emerald-100', name: 'Success text on success light bg', large: false, ui: false },
  { fg: 'amber-700', bg: 'amber-50', name: 'Warning text on warning bg', large: false, ui: false },
  { fg: 'amber-700', bg: 'amber-100', name: 'Warning text on warning light bg', large: false, ui: false },
  { fg: 'red-700', bg: 'red-50', name: 'Error text on error bg', large: false, ui: false },
  { fg: 'red-700', bg: 'red-100', name: 'Error text on error light bg', large: false, ui: false },
  { fg: 'blue-700', bg: 'blue-50', name: 'Info text on info bg', large: false, ui: false },
  { fg: 'blue-700', bg: 'blue-100', name: 'Info text on info light bg', large: false, ui: false },

  // Borders and UI components
  { fg: 'border-default', bg: 'warm-white', name: 'Border on warm-white', large: false, ui: true },
  { fg: 'border-default', bg: 'stone-50', name: 'Border on stone-50', large: false, ui: true },
    { fg: 'border-dark', bg: 'warm-white', name: 'Emphasized border on warm-white', large: false, ui: true },

  // Focus indicators
  { fg: 'border-focus', bg: 'warm-white', name: 'Focus ring on warm-white', large: false, ui: true },
  { fg: 'border-focus', bg: 'stone-50', name: 'Focus ring on stone-50', large: false, ui: true },

  // Placeholder text
  { fg: 'placeholder-default', bg: 'warm-white', name: 'Placeholder on warm-white', large: false, ui: false },
  { fg: 'placeholder-default', bg: 'stone-100', name: 'Placeholder on stone-100 (input bg)', large: false, ui: false },
  { fg: 'placeholder-light', bg: 'warm-white', name: 'Light placeholder on warm-white', large: false, ui: false },

  // Code/preformatted
  { fg: 'charcoal-900', bg: 'stone-100', name: 'Code text on stone-100', large: false, ui: false },

  // Badge text on colored backgrounds - white on 700 for 4.5:1 contrast
  { fg: 'white', bg: 'emerald-700', name: 'White on emerald-700 (badge)', large: false, ui: false },
  { fg: 'white', bg: 'amber-700', name: 'White on amber-700 (badge)', large: false, ui: false },
  { fg: 'white', bg: 'red-700', name: 'White on red-700 (badge)', large: false, ui: false },
  { fg: 'white', bg: 'blue-700', name: 'White on blue-700 (badge)', large: false, ui: false },
  { fg: 'charcoal-900', bg: 'charcoal-100', name: 'Charcoal on charcoal-100 (badge)', large: false, ui: false },
];

let failCount = 0;
let passCount = 0;

console.log('Text Contrast (4.5:1 normal, 3:1 large):');
console.log('─'.repeat(80));

pairs.forEach(pair => {
  const fg = colors[pair.fg];
  const bg = colors[pair.bg];
  if (!fg || !bg) {
    console.log(`⚠️  ${pair.name}: Missing color (fg=${pair.fg}, bg=${pair.bg})`);
    return;
  }

  const result = checkContrast(fg, bg, pair.large, pair.ui);
  const status = result.passes ? '✅' : '❌';
  if (!result.passes) failCount++;
  else passCount++;

  console.log(`${status} ${pair.name}`);
  console.log(`   FG: ${pair.fg} (${fg})  BG: ${pair.bg} (${bg})`);
  console.log(`   Ratio: ${result.ratio}:1  Required: ${result.threshold}:1  Level: ${result.level}`);
  console.log();
});

console.log('─'.repeat(80));
console.log(`\nSummary: ${passCount} passed, ${failCount} failed\n`);

if (failCount > 0) {
  console.log('❌ FAIL: Some color combinations do not meet WCAG AA requirements.');
  console.log('   Review the failed pairs above and adjust colors accordingly.');
  process.exit(1);
} else {
  console.log('✅ PASS: All checked color combinations meet WCAG AA requirements.');
  process.exit(0);
}