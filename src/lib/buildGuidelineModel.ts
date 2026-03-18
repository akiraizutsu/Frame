import type { NormalizedInput, GuidelineModel } from './types.js';
import { generateLogos } from './generateLogo.js';

export function buildGuidelineModel(input: NormalizedInput): GuidelineModel {
  const logos = generateLogos(
    input.brand_name,
    input.brand_keywords,
    input.visual_keywords,
  );

  return {
    brand_name: input.brand_name,
    category: input.category,
    purpose_block: input.purpose_block,
    personality: input.personality,
    tone_of_voice: input.tone_of_voice,
    verbal_rules: input.verbal_rules,
    typography_rationale: input.typography_rationale,
    color_rationale: input.color_rationale,
    brand_keywords: input.brand_keywords,
    visual_keywords: input.visual_keywords,
    logo_direction_candidates: input.logo_direction_candidates,
    logo_donts: input.logo_donts,
    site_structure: input.site_structure,
    transparency_commitments: input.transparency_commitments,
    disclosure_items: input.disclosure_items,
    claims_all: input.claims,
    cta: input.cta,
    logos,
  };
}
