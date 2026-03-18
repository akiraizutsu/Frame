/**
 * Theme Resolver — Automatically selects fonts and color based on brand context.
 *
 * Analyzes category, keywords, personality, visual keywords to determine
 * the best-fit typographic pairing and color hue.
 */

export interface ResolvedTheme {
  hue: number;
  hueName: string;
  fontHeading: string;
  fontBody: string;
  fontMono: string;
  googleFontsUrl: string;
  fontRationale: string;
  colorRationale: string;
}

interface ThemeProfile {
  id: string;
  label: string;
  signals: RegExp;
  hue: number;
  hueName: string;
  fontHeading: string;
  fontBody: string;
  fontMono: string;
  fontRationale: string;
  colorRationale: string;
}

const PROFILES: ThemeProfile[] = [
  {
    id: 'tech',
    label: 'Tech / SaaS',
    signals: /tech|saas|ソフトウェア|プラットフォーム|api|デジタル|ai|機械学習|自動化|クラウド|データ|分析|エンジニア|開発|プログラ|it|software|digital|cloud|automation/i,
    hue: 220,
    hueName: 'Blue',
    fontHeading: 'Outfit',
    fontBody: 'Inter',
    fontMono: 'JetBrains Mono',
    fontRationale: 'ジオメトリックなOutfitで技術的な明快さを、Interの高い可読性でデータ表示の正確性を担保。',
    colorRationale: 'ブルー系（hue:220）。信頼性と冷静さを示し、技術サービスとしての安定感を視覚的に伝える。',
  },
  {
    id: 'creative',
    label: 'Creative / Design',
    signals: /デザイン|クリエイティブ|アート|ブランド|制作|映像|写真|イラスト|建築|ファッション|design|creative|art|studio|agency|fashion|architect/i,
    hue: 262,
    hueName: 'Purple',
    fontHeading: 'DM Serif Display',
    fontBody: 'DM Sans',
    fontMono: 'JetBrains Mono',
    fontRationale: 'セリフ体DM Serif Displayの造形美で創造性を示し、DM Sansの端正さで実務能力を補強する対比。',
    colorRationale: 'パープル系（hue:262）。創造性と独自性を示しつつ、深みのあるトーンで安易なポップさを避ける。',
  },
  {
    id: 'education',
    label: 'Education / Learning',
    signals: /教育|学習|学び|スクール|研修|トレーニング|カリキュラム|講座|塾|大学|知識|education|learn|school|academy|course|training|edtech/i,
    hue: 230,
    hueName: 'Indigo',
    fontHeading: 'Outfit',
    fontBody: 'Inter',
    fontMono: 'JetBrains Mono',
    fontRationale: 'Outfitの幾何学的な明快さで学びの構造を示し、Interの長文可読性で教材としての耐久性を確保。',
    colorRationale: 'インディゴ系（hue:230）。知的さと落ち着きを示し、長時間の学習環境でも疲れにくい色相。',
  },
  {
    id: 'health',
    label: 'Healthcare / Wellness',
    signals: /医療|健康|ヘルスケア|ウェルネス|介護|福祉|病院|クリニック|薬|栄養|フィットネス|メンタル|health|medical|wellness|clinic|care|fitness|mental/i,
    hue: 168,
    hueName: 'Teal',
    fontHeading: 'Source Sans 3',
    fontBody: 'Source Sans 3',
    fontMono: 'Source Code Pro',
    fontRationale: 'Source Sans 3のニュートラルで信頼感ある書体で、医療・健康情報の正確性と親しみやすさを両立。',
    colorRationale: 'ティール系（hue:168）。清潔さと安心感を示し、医療的な冷たさを避けた温かみのある中間色。',
  },
  {
    id: 'finance',
    label: 'Finance / Legal',
    signals: /金融|銀行|保険|投資|会計|法律|法務|税|ファイナンス|コンサル|finance|bank|insurance|invest|legal|tax|accounting|consult/i,
    hue: 215,
    hueName: 'Navy',
    fontHeading: 'IBM Plex Sans',
    fontBody: 'IBM Plex Sans',
    fontMono: 'IBM Plex Mono',
    fontRationale: 'IBM Plexの堅牢で信頼感ある書体ファミリー。金融・法務の文書に求められる厳格さと可読性を統一的に提供。',
    colorRationale: 'ネイビー系（hue:215）。権威性と安定感を示し、金融・法務サービスへの信頼を色で裏付ける。',
  },
  {
    id: 'food',
    label: 'Food / Lifestyle',
    signals: /食|料理|レストラン|カフェ|飲食|農|オーガニック|ライフスタイル|暮らし|住|インテリア|food|restaurant|cafe|organic|lifestyle|kitchen|cooking/i,
    hue: 28,
    hueName: 'Amber',
    fontHeading: 'Josefin Sans',
    fontBody: 'Nunito',
    fontMono: 'JetBrains Mono',
    fontRationale: 'Josefin Sansのエレガントな軽さで洗練を、Nunitoの丸みで親しみやすさと温かみを表現。',
    colorRationale: 'アンバー系（hue:28）。温かみと自然さを示し、食や暮らしに関わるブランドの有機的な印象を伝える。',
  },
  {
    id: 'nature',
    label: 'Nature / Environment',
    signals: /環境|自然|エコ|サステナ|農業|土壌|植物|エネルギー|再生|循環|nature|eco|sustain|green|energy|environment|earth|organic/i,
    hue: 152,
    hueName: 'Emerald',
    fontHeading: 'Outfit',
    fontBody: 'Inter',
    fontMono: 'JetBrains Mono',
    fontRationale: 'Outfitの幾何学的な構造で科学的なアプローチを示し、Interの正確なデータ表示で環境データの信頼性を補強。',
    colorRationale: 'エメラルド系（hue:152）。自然環境との調和を示しつつ、安易なグリーンウォッシュを避けた深みのあるトーン。',
  },
  {
    id: 'community',
    label: 'Community / Social',
    signals: /コミュニティ|ソーシャル|npo|ngo|社会|地域|ボランティア|つなが|支援|共助|community|social|nonprofit|connect|support|together/i,
    hue: 187,
    hueName: 'Cyan',
    fontHeading: 'Outfit',
    fontBody: 'Nunito',
    fontMono: 'JetBrains Mono',
    fontRationale: 'Outfitの明快さで組織の透明性を、Nunitoの丸みで人間的な温かみと親しみやすさを表現。',
    colorRationale: 'シアン系（hue:187）。開放性とつながりを示し、誰にとっても中立的で親しみやすい色相。',
  },
];

const DEFAULT_PROFILE: ThemeProfile = {
  id: 'default',
  label: 'General',
  signals: /./,
  hue: 210,
  hueName: 'Slate Blue',
  fontHeading: 'Outfit',
  fontBody: 'Inter',
  fontMono: 'JetBrains Mono',
  fontRationale: 'Outfitの現代的なジオメトリック体とInterの高い可読性による汎用的な組み合わせ。',
  colorRationale: 'スレートブルー系（hue:210）。業種を問わず信頼感と落ち着きを伝える中立的な色相。',
};

function buildGoogleFontsUrl(heading: string, body: string, mono: string): string {
  const fonts = new Set<string>();

  const encode = (name: string, weights: string) =>
    `family=${name.replace(/ /g, '+')}:wght@${weights}`;

  // Heading weights: 500, 600, 700
  fonts.add(encode(heading, '500;600;700'));

  // Body weights: 400, 500, 600, 700 (if different from heading)
  if (body !== heading) {
    fonts.add(encode(body, '400;500;600;700'));
  }

  // Mono
  fonts.add(encode(mono, '400;500'));

  // Always include Noto Sans JP for Japanese
  fonts.add(encode('Noto Sans JP', '400;500;700'));

  return `https://fonts.googleapis.com/css2?${Array.from(fonts).join('&')}&display=swap`;
}

export function resolveTheme(
  category: string,
  brandKeywords: string[],
  visualKeywords: string[],
  personality: string,
  toneOfVoice: string,
): ResolvedTheme {
  // Build a single text corpus for matching
  const corpus = [
    category,
    ...brandKeywords,
    ...visualKeywords,
    personality,
    toneOfVoice,
  ].join(' ').toLowerCase();

  // Score each profile by counting all signal matches (global)
  let bestProfile = DEFAULT_PROFILE;
  let bestScore = 0;

  for (const profile of PROFILES) {
    const globalRegex = new RegExp(profile.signals.source, 'gi');
    const matches = corpus.match(globalRegex);
    const score = matches ? matches.length : 0;
    if (score > bestScore) {
      bestScore = score;
      bestProfile = profile;
    }
  }

  return {
    hue: bestProfile.hue,
    hueName: bestProfile.hueName,
    fontHeading: bestProfile.fontHeading,
    fontBody: bestProfile.fontBody,
    fontMono: bestProfile.fontMono,
    googleFontsUrl: buildGoogleFontsUrl(
      bestProfile.fontHeading,
      bestProfile.fontBody,
      bestProfile.fontMono,
    ),
    fontRationale: bestProfile.fontRationale,
    colorRationale: bestProfile.colorRationale,
  };
}
