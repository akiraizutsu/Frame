/** Proof type labels for structured claims */
export type ProofType = 'FACT' | 'CONSTRAINT' | 'TRADE_OFF' | 'TIME_AXIS' | 'TESTIMONY';

export interface Claim {
  title: string;
  claim: string;
  proof_type?: ProofType;
  evidence?: string;
  comparison_resistance?: string;
}

export interface BrandInput {
  brand_name: string;
  category?: string;
  audience?: string;
  audience_before_state?: string;
  audience_after_state?: string;
  purpose_block?: string;
  claims?: Claim[];
  site_structure?: string[];
  brand_keywords?: string[];
  visual_keywords?: string[];
  logo_direction_candidates?: string[];
  logo_donts?: string[];
  personality?: string;
  tone_of_voice?: string;
  verbal_rules?: string[];
  typography_rationale?: string;
  color_rationale?: string;
  transparency_commitments?: string[];
  disclosure_items?: string[];
  cta?: string;
  optional_case_examples?: string[];
  optional_references?: string[];
}

export interface NormalizedInput extends Required<Omit<BrandInput, 'claims'>> {
  claims: Claim[];
}

export interface NormalizationWarning {
  field: string;
  message: string;
}

export interface NormalizationResult {
  data: NormalizedInput;
  warnings: NormalizationWarning[];
}

/** Resolved theme for document rendering */
export interface ThemeConfig {
  hue: number;
  hueName: string;
  fontHeading: string;
  fontBody: string;
  fontMono: string;
  googleFontsUrl: string;
  fontRationale: string;
  colorRationale: string;
}

/** Story document view model */
export interface StoryModel {
  brand_name: string;
  category: string;
  theme: ThemeConfig;
  purpose_block: string;
  audience: string;
  audience_before_state: string;
  audience_after_state: string;
  claims_by_type: Record<ProofType, Claim[]>;
  claims_all: Claim[];
  constraints: Claim[];
  trade_offs: Claim[];
  facts: Claim[];
  time_axes: Claim[];
  testimonies: Claim[];
  transparency_commitments: string[];
  disclosure_items: string[];
  cta: string;
  optional_case_examples: string[];
  optional_references: string[];
  brand_keywords: string[];
}

/** Guideline document view model */
export interface GuidelineModel {
  brand_name: string;
  category: string;
  theme: ThemeConfig;
  purpose_block: string;
  personality: string;
  tone_of_voice: string;
  verbal_rules: string[];
  typography_rationale: string;
  color_rationale: string;
  brand_keywords: string[];
  visual_keywords: string[];
  logo_direction_candidates: string[];
  logo_donts: string[];
  site_structure: string[];
  transparency_commitments: string[];
  disclosure_items: string[];
  claims_all: Claim[];
  cta: string;
  logos: { type: string; label: string; description: string; svg: string }[];
}
