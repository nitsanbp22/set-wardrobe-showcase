import type { ClothingItem } from '@/domain/clothing/types';
import { normalizeCategory } from '@/domain/taxonomy/normalizeTaxonomy';

export type OutfitValidationErrorCode =
  | 'EMPTY_OUTFIT'
  | 'MISSING_CORE'
  | 'ONE_PIECE_WITH_BOTTOM'
  | 'ONE_PIECE_WITH_PRIMARY_TOP'
  | 'MULTIPLE_ONE_PIECES'
  | 'MULTIPLE_BOTTOMS'
  | 'MULTIPLE_SHOES'
  | 'MULTIPLE_BAGS'
  | 'MULTIPLE_OUTERWEAR'
  | 'TOO_MANY_TOPS'
  | 'INVALID_LAYER_COMBINATION'
  | 'MISSING_SHOES_FOR_COMPLETE_OUTFIT';

export interface OutfitValidationError {
  code: OutfitValidationErrorCode;
  message: string;
}

export interface OutfitValidationResult {
  valid: boolean;
  errors: OutfitValidationError[];
}

/**
 * Distinguishes a complete one-piece base (dress, jumpsuit, romper, etc.)
 * from separates. Bodysuits remain tops because they still require bottoms.
 *
 * Portfolio sample copied from the private production codebase. Imports refer
 * to domain modules that are intentionally not included in this showcase.
 */
export function isOnePiece(item: ClothingItem): boolean {
  const normalizedCategory = normalizeCategory(item.category, item.subcategory);

  if (normalizedCategory === 'one_piece') {
    const subcategory = (item.subcategory ?? '').toLowerCase();
    if (subcategory.includes('bodysuit')) return false;
    return true;
  }

  return false;
}

/**
 * Checks whether two tops can form a plausible layered combination, such as a
 * fitted tank under an open shirt/cardigan or a light base under a relaxed knit.
 */
export function canLayerTops(base: ClothingItem, mid: ClothingItem): boolean {
  if (base.id === mid.id) return false;

  const baseCategory = normalizeCategory(base.category, base.subcategory);
  const midCategory = normalizeCategory(mid.category, mid.subcategory);
  if (baseCategory !== 'top' || midCategory !== 'top') return false;

  const baseSub = (base.subcategory ?? '').toLowerCase();
  const midSub = (mid.subcategory ?? '').toLowerCase();
  const midSleeve = (mid.sleeveLength ?? '').toLowerCase();
  const baseSleeve = (base.sleeveLength ?? '').toLowerCase();

  const isMidLongSleeve =
    midSleeve === 'long' ||
    midSleeve === 'three_quarter' ||
    midSub.includes('long_sleeve') ||
    midSub.includes('shirt') ||
    midSub.includes('overshirt') ||
    midSub.includes('cardigan') ||
    midSub.includes('knit') ||
    midSub.includes('sweater') ||
    midSub.includes('hoodie') ||
    midSub.includes('blouse');

  const isBaseOuterOnly =
    baseSub.includes('sweater') ||
    baseSub.includes('hoodie') ||
    baseSub.includes('sweatshirt');

  const baseIsLayerable =
    !isBaseOuterOnly &&
    (baseSub.includes('tank') ||
      baseSub.includes('bralette') ||
      baseSub.includes('crop') ||
      baseSub.includes('camisole') ||
      baseSub.includes('sports bra') ||
      baseSub.includes('bodysuit') ||
      baseSub.includes('t_shirt') ||
      baseSub.includes('t-shirt') ||
      baseSub.includes('tee') ||
      baseSleeve === 'short' ||
      baseSleeve === 'sleeveless' ||
      base.fit === 'fitted' ||
      base.fit === 'very_fitted' ||
      (baseSub.includes('shirt') && base.fit === 'regular'));

  const midIsLayerable =
    isMidLongSleeve ||
    mid.fit === 'relaxed' ||
    mid.fit === 'oversized' ||
    midSub.includes('shirt') ||
    midSub.includes('cardigan') ||
    midSub.includes('knit') ||
    midSub.includes('sweater') ||
    midSub.includes('hoodie') ||
    midSub.includes('blouse');

  return Boolean(baseIsLayerable && midIsLayerable);
}

export interface ValidateOutfitOptions {
  /** Require exactly one pair of shoes for a complete recommendation. */
  isCompleteRecommendation?: boolean;
  /** Allow an incomplete outfit while a user is manually building it. */
  allowPartialWip?: boolean;
}

/**
 * Canonical invariant validator shared by outfit-related product flows.
 *
 * Structure A — separates:
 *   one primary top + one bottom (+ an optional valid mid-layer top)
 *
 * Structure B — one-piece:
 *   one dress/one-piece, with no bottom or primary top
 */
export function validateOutfitInvariants(
  items: ClothingItem[],
  options: ValidateOutfitOptions = {}
): OutfitValidationResult {
  const errors: OutfitValidationError[] = [];
  const { isCompleteRecommendation = false, allowPartialWip = false } = options;

  if (items.length === 0) {
    if (!allowPartialWip) {
      errors.push({ code: 'EMPTY_OUTFIT', message: 'Outfit must contain at least one item.' });
    }
    return { valid: errors.length === 0, errors };
  }

  const normalizedItems = items.map((item) => ({
    ...item,
    category: normalizeCategory(item.category, item.subcategory),
  }));

  const onePieces = normalizedItems.filter(isOnePiece);
  const tops = normalizedItems.filter((item) => item.category === 'top');
  const bottoms = normalizedItems.filter((item) => item.category === 'bottom');
  const shoes = normalizedItems.filter((item) => item.category === 'shoes');
  const outerwear = normalizedItems.filter((item) => item.category === 'outerwear');
  const bags = normalizedItems.filter((item) => item.category === 'bag');

  if (onePieces.length > 0) {
    if (onePieces.length > 1) {
      errors.push({
        code: 'MULTIPLE_ONE_PIECES',
        message: 'An outfit can contain at most one dress or one-piece garment.',
      });
    }

    if (bottoms.length > 0) {
      errors.push({
        code: 'ONE_PIECE_WITH_BOTTOM',
        message: 'A dress or one-piece cannot be combined with bottoms.',
      });
    }

    if (tops.length > 0) {
      errors.push({
        code: 'ONE_PIECE_WITH_PRIMARY_TOP',
        message: 'A dress or one-piece cannot be combined with a primary top.',
      });
    }
  } else {
    if (!allowPartialWip && (tops.length === 0 || bottoms.length === 0)) {
      errors.push({
        code: 'MISSING_CORE',
        message: 'A separates outfit must contain at least one top and one bottom.',
      });
    }

    if (bottoms.length > 1) {
      errors.push({ code: 'MULTIPLE_BOTTOMS', message: 'An outfit can contain at most one bottom.' });
    }

    if (tops.length > 2) {
      errors.push({
        code: 'TOO_MANY_TOPS',
        message: 'An outfit can contain at most two tops (one base and one mid-layer).',
      });
    } else if (tops.length === 2) {
      const [firstTop, secondTop] = tops;
      const validLayer = canLayerTops(firstTop, secondTop) || canLayerTops(secondTop, firstTop);
      if (!validLayer) {
        errors.push({
          code: 'INVALID_LAYER_COMBINATION',
          message: 'The selected tops cannot be layered together physically.',
        });
      }
    }
  }

  if (shoes.length > 1) {
    errors.push({ code: 'MULTIPLE_SHOES', message: 'An outfit can contain at most one pair of shoes.' });
  } else if (isCompleteRecommendation && shoes.length === 0) {
    errors.push({
      code: 'MISSING_SHOES_FOR_COMPLETE_OUTFIT',
      message: 'A complete recommendation must include a pair of shoes.',
    });
  }

  if (bags.length > 1) {
    errors.push({ code: 'MULTIPLE_BAGS', message: 'An outfit can contain at most one bag.' });
  }

  if (outerwear.length > 1) {
    errors.push({
      code: 'MULTIPLE_OUTERWEAR',
      message: 'An outfit can contain at most one primary outerwear layer.',
    });
  }

  return { valid: errors.length === 0, errors };
}
