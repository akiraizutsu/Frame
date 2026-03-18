/**
 * SVG Logo Generator for BrandFrame
 *
 * Generates abstract SVG logos based on brand name and keywords.
 * These are conceptual direction logos, not final production assets.
 *
 * Approach: Creates multiple logo candidates based on different abstract strategies:
 * 1. Monogram — Initials in a geometric container
 * 2. Geometric Mark — Abstract shape derived from keyword semantics
 * 3. Wordmark — Typographic treatment of the brand name
 */

interface LogoConfig {
  brandName: string;
  hue: number;
  keywords: string[];
  visualKeywords: string[];
}

/** Simple deterministic hash for consistent output from same input */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32-bit int
  }
  return Math.abs(hash);
}

function hslColor(hue: number, sat: number, light: number): string {
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

/** Generate Monogram Logo — initials in geometric shape */
function generateMonogram(config: LogoConfig): string {
  const { brandName, hue } = config;
  // Extract initials (first letter, or first two letters of single word)
  const words = brandName.trim().split(/\s+/);
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : brandName.substring(0, 2).toUpperCase();

  const primary = hslColor(hue, 65, 45);
  const primaryDark = hslColor(hue, 60, 30);
  const primaryLight = hslColor(hue, 85, 95);

  const hash = simpleHash(brandName);
  const shapeType = hash % 3; // circle, rounded-square, or hexagon

  let container = '';
  if (shapeType === 0) {
    // Circle
    container = `<circle cx="120" cy="120" r="100" fill="${primary}"/>`;
  } else if (shapeType === 1) {
    // Rounded square
    container = `<rect x="20" y="20" width="200" height="200" rx="40" fill="${primary}"/>`;
  } else {
    // Hexagon
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      points.push(`${120 + 100 * Math.cos(angle)},${120 + 100 * Math.sin(angle)}`);
    }
    container = `<polygon points="${points.join(' ')}" fill="${primary}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="auto" style="max-width:200px">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@700');
      .monogram-text { font-family: 'Ubuntu', sans-serif; font-weight: 700; }
    </style>
  </defs>
  ${container}
  <text x="120" y="132" text-anchor="middle" dominant-baseline="middle" class="monogram-text" font-size="72" fill="white" letter-spacing="4">${initials}</text>
</svg>`;
}

/** Generate Geometric Mark — abstract shape from brand semantics */
function generateGeometricMark(config: LogoConfig): string {
  const { brandName, hue, keywords } = config;
  const hash = simpleHash(brandName + keywords.join(''));

  const primary = hslColor(hue, 65, 45);
  const primaryMid = hslColor(hue, 55, 55);
  const primaryLight = hslColor(hue, 75, 70);

  // Determine shape family based on keyword analysis
  const allText = keywords.join(' ').toLowerCase();
  const hasGrowth = /成長|向上|学習|育|伸|step|grow|learn/i.test(allText);
  const hasStructure = /構造|設計|分析|整理|体系|structure|system|frame/i.test(allText);
  const hasConnect = /接続|つなが|コミュニティ|連携|connect|community|link/i.test(allText);
  const hasBalance = /中立|バランス|公平|信頼|balance|trust|neutral/i.test(allText);

  let shapes = '';

  if (hasGrowth) {
    // Ascending steps / layers
    shapes = `
    <rect x="30" y="160" width="50" height="50" rx="6" fill="${primaryLight}" opacity="0.7"/>
    <rect x="95" y="110" width="50" height="100" rx="6" fill="${primaryMid}" opacity="0.85"/>
    <rect x="160" y="50" width="50" height="160" rx="6" fill="${primary}"/>`;
  } else if (hasStructure) {
    // Interlocking geometric grid
    shapes = `
    <rect x="35" y="35" width="75" height="75" rx="10" fill="${primary}"/>
    <rect x="130" y="35" width="75" height="75" rx="10" fill="${primaryMid}"/>
    <rect x="35" y="130" width="75" height="75" rx="10" fill="${primaryMid}"/>
    <rect x="130" y="130" width="75" height="75" rx="10" fill="${primaryLight}" opacity="0.7"/>
    <rect x="83" y="83" width="75" height="75" rx="10" fill="white" opacity="0.15"/>`;
  } else if (hasConnect) {
    // Connected nodes
    const cx1 = 70, cy1 = 80;
    const cx2 = 170, cy2 = 80;
    const cx3 = 120, cy3 = 175;
    shapes = `
    <line x1="${cx1}" y1="${cy1}" x2="${cx2}" y2="${cy2}" stroke="${primaryLight}" stroke-width="3" opacity="0.5"/>
    <line x1="${cx2}" y1="${cy2}" x2="${cx3}" y2="${cy3}" stroke="${primaryLight}" stroke-width="3" opacity="0.5"/>
    <line x1="${cx3}" y1="${cy3}" x2="${cx1}" y2="${cy1}" stroke="${primaryLight}" stroke-width="3" opacity="0.5"/>
    <circle cx="${cx1}" cy="${cy1}" r="28" fill="${primary}"/>
    <circle cx="${cx2}" cy="${cy2}" r="22" fill="${primaryMid}"/>
    <circle cx="${cx3}" cy="${cy3}" r="25" fill="${primaryMid}"/>`;
  } else if (hasBalance) {
    // Balanced circles / yin-yang inspired
    shapes = `
    <circle cx="120" cy="120" r="90" fill="none" stroke="${primaryLight}" stroke-width="2" opacity="0.4"/>
    <circle cx="90" cy="120" r="45" fill="${primary}"/>
    <circle cx="150" cy="120" r="45" fill="${primaryMid}"/>
    <circle cx="120" cy="120" r="15" fill="white" opacity="0.3"/>`;
  } else {
    // Default: abstract layered shape
    const variant = hash % 2;
    if (variant === 0) {
      // Overlapping circles
      shapes = `
    <circle cx="95" cy="100" r="55" fill="${primary}" opacity="0.85"/>
    <circle cx="145" cy="100" r="55" fill="${primaryMid}" opacity="0.7"/>
    <circle cx="120" cy="150" r="55" fill="${primaryLight}" opacity="0.6"/>`;
    } else {
      // Diamond stack
      shapes = `
    <rect x="75" y="30" width="90" height="90" rx="12" fill="${primary}" transform="rotate(45, 120, 75)"/>
    <rect x="75" y="90" width="70" height="70" rx="10" fill="${primaryMid}" opacity="0.7" transform="rotate(45, 110, 125)"/>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="100%" height="auto" style="max-width:200px">
  ${shapes}
</svg>`;
}

/** Generate Wordmark — typographic logo */
function generateWordmark(config: LogoConfig): string {
  const { brandName, hue } = config;
  const primary = hslColor(hue, 65, 45);
  const hash = simpleHash(brandName);

  // Calculate font size based on name length
  const nameLen = brandName.length;
  let fontSize: number;
  if (nameLen <= 4) fontSize = 64;
  else if (nameLen <= 7) fontSize = 48;
  else if (nameLen <= 10) fontSize = 36;
  else fontSize = 28;

  const letterSpacing = nameLen <= 6 ? 8 : 4;

  // Accent element
  const accentType = hash % 3;
  let accent = '';
  if (accentType === 0) {
    // Underline
    accent = `<line x1="40" y1="155" x2="320" y2="155" stroke="${primary}" stroke-width="3" stroke-linecap="round"/>`;
  } else if (accentType === 1) {
    // Dot
    accent = `<circle cx="340" cy="100" r="8" fill="${primary}"/>`;
  } else {
    // Small mark before name
    accent = `<rect x="20" y="85" width="6" height="30" rx="3" fill="${primary}"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200" width="100%" height="auto" style="max-width:240px">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@700');
      .wordmark { font-family: 'Ubuntu', sans-serif; font-weight: 700; }
    </style>
  </defs>
  ${accent}
  <text x="180" y="120" text-anchor="middle" dominant-baseline="middle" class="wordmark" font-size="${fontSize}" fill="${primary}" letter-spacing="${letterSpacing}">${brandName}</text>
</svg>`;
}

export interface LogoResult {
  type: 'monogram' | 'geometric' | 'wordmark';
  label: string;
  description: string;
  svg: string;
}

export function generateLogos(
  brandName: string,
  keywords: string[],
  visualKeywords: string[],
  hue: number = 187
): LogoResult[] {
  const config: LogoConfig = { brandName, hue, keywords, visualKeywords };

  return [
    {
      type: 'monogram',
      label: 'Monogram',
      description: `イニシャル「${brandName.substring(0, 2).toUpperCase()}」を幾何学的なコンテナに配置。アプリアイコンやファビコンに適する。`,
      svg: generateMonogram(config),
    },
    {
      type: 'geometric',
      label: 'Geometric Mark',
      description: 'ブランドキーワードから導出した抽象的な図形。ブランドの構造的特徴を視覚的に表現。',
      svg: generateGeometricMark(config),
    },
    {
      type: 'wordmark',
      label: 'Wordmark',
      description: `「${brandName}」のタイポグラフィック処理。記号に逃げず、名前そのものの認知を優先するアプローチ。`,
      svg: generateWordmark(config),
    },
  ];
}
