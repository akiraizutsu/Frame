import type { NormalizedInput, StoryModel, ProofType, Claim } from './types.js';

export function buildStoryModel(input: NormalizedInput): StoryModel {
  const claimsByType: Record<ProofType, Claim[]> = {
    FACT: [],
    CONSTRAINT: [],
    TRADE_OFF: [],
    TIME_AXIS: [],
    TESTIMONY: [],
  };

  for (const c of input.claims) {
    if (c.proof_type && c.proof_type in claimsByType) {
      claimsByType[c.proof_type].push(c);
    }
  }

  return {
    brand_name: input.brand_name,
    category: input.category,
    purpose_block: input.purpose_block,
    audience: input.audience,
    audience_before_state: input.audience_before_state,
    audience_after_state: input.audience_after_state,
    claims_by_type: claimsByType,
    claims_all: input.claims,
    constraints: claimsByType.CONSTRAINT,
    trade_offs: claimsByType.TRADE_OFF,
    facts: claimsByType.FACT,
    time_axes: claimsByType.TIME_AXIS,
    testimonies: claimsByType.TESTIMONY,
    transparency_commitments: input.transparency_commitments,
    disclosure_items: input.disclosure_items,
    cta: input.cta,
    optional_case_examples: input.optional_case_examples,
    optional_references: input.optional_references,
    brand_keywords: input.brand_keywords,
  };
}
