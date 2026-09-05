import { MIN_RECOMMENDATION_SCORE } from '@/config/recommendationWeights';
import { CANDIDATE_LIMITS } from '@/config/candidateLimits';
import { generateCandidates } from './generateCandidates';
import { scoreCandidate } from './scoreCandidate';
import { diversifyResults } from './diversify';
import { DEFAULT_RECOMMENDATION_CONTEXT, type RecommendationInput } from './types';

/**
 * Generate a diverse, occasion-accurate set of outfit recommendations.
 *
 * Architecture:
 * 1. Merge input context with canonical default context.
 * 2. Build an in-memory catalog map.
 * 3. Generate structurally valid candidates.
 * 4. Score candidates across styling, context and personalization dimensions.
 * 5. Apply a minimum quality threshold.
 * 6. Apply diversity-aware ranking.
 *
 * This file is copied from the private production codebase as a portfolio sample.
 * Its imports intentionally reference modules that are not included in this
 * non-deployable showcase repository.
 */
export function generateRecommendations(input: RecommendationInput) {
  const context = {
    ...DEFAULT_RECOMMENDATION_CONTEXT,
    ...input.context,
    occasion: input.context?.occasion || DEFAULT_RECOMMENDATION_CONTEXT.occasion,
    silhouette: input.context?.silhouette || DEFAULT_RECOMMENDATION_CONTEXT.silhouette,
  };

  const { items, personalStyle, bodyProfile } = input;
  const batchSize = input.batchSize ?? CANDIDATE_LIMITS.shown;
  const excludeSignatures = input.excludeSignatures;
  const anchorFingerprint = input.anchorFingerprint;
  const excludeAnchorItemIds = input.excludeAnchorItemIds;
  const sessionItemUsageCount = input.sessionItemUsageCount;
  const sessionStructureUsage = input.sessionStructureUsage;

  const catalog = new Map(items.map((item) => [item.id, item]));

  const candidates = generateCandidates(items, context, {
    excludeSignatures,
    anchorFingerprint,
    excludeAnchorItemIds,
    sessionItemUsageCount,
  });

  const scored = candidates
    .map((candidate) => scoreCandidate(candidate, catalog, context, personalStyle, bodyProfile))
    .filter((result) => result.score >= MIN_RECOMMENDATION_SCORE);

  return diversifyResults(scored, batchSize, catalog, {
    sessionItemUsageCount,
    sessionStructureUsage,
  });
}
