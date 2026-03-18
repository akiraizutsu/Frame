import type { BrandInput, NormalizedInput, NormalizationResult, NormalizationWarning, Claim, ProofType } from './types.js';

const VALID_PROOF_TYPES: ProofType[] = ['FACT', 'CONSTRAINT', 'TRADE_OFF', 'TIME_AXIS', 'TESTIMONY'];

function str(val: unknown, fallback: string): string {
  if (typeof val === 'string' && val.trim().length > 0) return val.trim();
  return fallback;
}

function arr(val: unknown, fallback: string[]): string[] {
  if (Array.isArray(val) && val.length > 0) return val.map(v => String(v).trim()).filter(Boolean);
  return fallback;
}

function normalizeClaim(raw: unknown, warnings: NormalizationWarning[], index: number): Claim | null {
  if (typeof raw !== 'object' || raw === null) {
    warnings.push({ field: `claims[${index}]`, message: 'Invalid claim object — skipped' });
    return null;
  }
  const obj = raw as Record<string, unknown>;
  const title = str(obj.title, '');
  const claim = str(obj.claim, '');
  if (!title && !claim) {
    warnings.push({ field: `claims[${index}]`, message: 'Claim has no title or claim text — skipped' });
    return null;
  }
  const result: Claim = {
    title: title || `Claim ${index + 1}`,
    claim: claim || '（未記入）',
  };
  if (obj.proof_type) {
    const pt = String(obj.proof_type).toUpperCase().trim() as ProofType;
    if (VALID_PROOF_TYPES.includes(pt)) {
      result.proof_type = pt;
    } else {
      warnings.push({ field: `claims[${index}].proof_type`, message: `Unknown proof_type "${obj.proof_type}" — left unset` });
    }
  } else {
    warnings.push({ field: `claims[${index}].proof_type`, message: 'proof_type is missing — will be displayed without label' });
  }
  result.evidence = str(obj.evidence, '');
  result.comparison_resistance = str(obj.comparison_resistance, '');
  return result;
}

export function normalizeInput(raw: unknown): NormalizationResult {
  const warnings: NormalizationWarning[] = [];

  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Input must be a JSON/YAML object');
  }

  const input = raw as Record<string, unknown>;

  if (!input.brand_name || typeof input.brand_name !== 'string' || input.brand_name.trim().length === 0) {
    throw new Error('brand_name is required and must be a non-empty string');
  }

  const PLACEHOLDER = '（未設定 — 入力データに追加してください）';

  const optional_string_fields = [
    'category', 'audience', 'audience_before_state', 'audience_after_state',
    'purpose_block', 'personality', 'tone_of_voice',
    'typography_rationale', 'color_rationale', 'cta',
  ] as const;

  const optional_array_fields = [
    'site_structure', 'brand_keywords', 'visual_keywords',
    'logo_direction_candidates', 'logo_donts', 'verbal_rules',
    'transparency_commitments', 'disclosure_items',
    'optional_case_examples', 'optional_references',
  ] as const;

  for (const f of optional_string_fields) {
    if (!input[f] || typeof input[f] !== 'string' || (input[f] as string).trim().length === 0) {
      warnings.push({ field: f, message: `Missing — placeholder inserted` });
    }
  }
  for (const f of optional_array_fields) {
    if (!Array.isArray(input[f]) || (input[f] as unknown[]).length === 0) {
      warnings.push({ field: f, message: `Missing or empty array` });
    }
  }

  const claims: Claim[] = [];
  if (Array.isArray(input.claims)) {
    for (let i = 0; i < (input.claims as unknown[]).length; i++) {
      const c = normalizeClaim((input.claims as unknown[])[i], warnings, i);
      if (c) claims.push(c);
    }
  } else {
    warnings.push({ field: 'claims', message: 'No claims provided — brand story will lack structured arguments' });
  }

  const data: NormalizedInput = {
    brand_name: input.brand_name as string,
    category: str(input.category, PLACEHOLDER),
    audience: str(input.audience, PLACEHOLDER),
    audience_before_state: str(input.audience_before_state, PLACEHOLDER),
    audience_after_state: str(input.audience_after_state, PLACEHOLDER),
    purpose_block: str(input.purpose_block, PLACEHOLDER),
    claims,
    site_structure: arr(input.site_structure, []),
    brand_keywords: arr(input.brand_keywords, []),
    visual_keywords: arr(input.visual_keywords, []),
    logo_direction_candidates: arr(input.logo_direction_candidates, []),
    logo_donts: arr(input.logo_donts, []),
    personality: str(input.personality, PLACEHOLDER),
    tone_of_voice: str(input.tone_of_voice, PLACEHOLDER),
    verbal_rules: arr(input.verbal_rules, []),
    typography_rationale: str(input.typography_rationale, PLACEHOLDER),
    color_rationale: str(input.color_rationale, PLACEHOLDER),
    transparency_commitments: arr(input.transparency_commitments, []),
    disclosure_items: arr(input.disclosure_items, []),
    cta: str(input.cta, PLACEHOLDER),
    optional_case_examples: arr(input.optional_case_examples, []),
    optional_references: arr(input.optional_references, []),
  };

  return { data, warnings };
}
