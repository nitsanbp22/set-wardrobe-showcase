import { MIN_RECOMMENDATION_SCORE } from '@/config/recommendationWeights';
import { CANDIDATE_LIMITS } from '@/config/candidateLimits';
import { generateCandidates } from './generateCandidates';
import { scoreCandidate } from './scoreCandidate';
import { diversifyResults } from './diversify';
import { DEFAULT_RECOMMENDATION_CONTEXT, type RecommendationInput } from './types';

function normalizeToken(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, ' ');
}

function itemMatchesExcludedKeyword(
  item: RecommendationInput['items'][number],
  keywords: string[] | undefined,
) {
  if (!keywords?.length) return false;
  const searchable = normalizeToken([
    item.name ?? '',
    item.subcategory ?? '',
    item.material ?? '',
    item.pattern ?? '',
    ...(item.styleTags ?? []),
  ].join(' '));

  return keywords.some((keyword) => searchable.includes(normalizeToken(keyword)));
}

function normalizeRequestedColors(colors: string[] | undefined) {
  if (!colors?.length) return undefined;
  const aliases: Record<string, string> = {
    gray: 'grey',
    multicolour: 'multicolor',
  };

  return Array.from(
    new Set(
      colors
        .map((color) => color.trim().toLowerCase().replace(/[\s-]+/g, '_'))
        .filter(Boolean)
        .map((color) => aliases[color] ?? color),
    ),
  );
}

/**
 * Generate a diverse, occasion-accurate set of outfit recommendations.
 *
 * Architecture:
 * 1. Merge input context with canonical defaults and normalize requested color families.
 * 2. Build the in-memory catalog map.
 * 3. Generate occasion-aware candidates with strict category-role validation.
 * 4. Score candidates across occasion, color, comfort, weather, personal style and proportions.
 * 5. Prefer the configured quality threshold, but keep the best-scoring pool as a safe fallback
 *    so a sparse closet does not produce an empty recommendation screen.
 * 6. Diversify the final batch with cumulative item and structure reuse penalties.
 */
export function generateRecommendations(input: RecommendationInput) {
  const context = {
    ...DEFAULT_RECOMMENDATION_CONTEXT,
    ...input.context,
    occasion: input.context?.occasion || DEFAULT_RECOMMENDATION_CONTEXT.occasion,
    silhouette: input.context?.silhouette || DEFAULT_RECOMMENDATION_CONTEXT.silhouette,
    colorFamilies: normalizeRequestedColors(input.context?.colorFamilies),
  };

  const { items, personalStyle, bodyProfile, batchSize = CANDIDATE_LIMITS.shown } = input;
  const eligibleItems = context.excludedKeywords?.length
    ? items.filter((item) => !itemMatchesExcludedKeyword(item, context.excludedKeywords))
    : items;
  const excludeSignatures = new Set([
    ...(input.excludeSignatures ?? []),
    ...(context.dislikedSignatures ?? []),
  ]);
  const anchorFingerprint = input.anchorFingerprint;
  const excludeAnchorItemIds = input.excludeAnchorItemIds;
  const sessionItemUsageCount = input.sessionItemUsageCount;
  const sessionStructureUsage = input.sessionStructureUsage;

  const catalog = new Map(eligibleItems.map((item) => [item.id, item]));

  const candidates = generateCandidates(eligibleItems, context, {
    excludeSignatures,
    anchorFingerprint,
    excludeAnchorItemIds,
    sessionItemUsageCount,
  });

  const scoredAll = candidates.map((candidate) =>
    scoreCandidate(candidate, catalog, context, personalStyle, bodyProfile)
  );

  const scoredAboveMin = scoredAll.filter(
    (result) => result.score >= MIN_RECOMMENDATION_SCORE
  );

  const pool =
    scoredAboveMin.length > 0
      ? scoredAboveMin
      : [...scoredAll].sort((a, b) => b.score - a.score).slice(0, batchSize * 2);

  return diversifyResults(pool, batchSize, catalog, {
    sessionItemUsageCount,
    sessionStructureUsage,
  });
}
