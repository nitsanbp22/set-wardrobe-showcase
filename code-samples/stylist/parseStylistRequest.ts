import {
  CANONICAL_OCCASIONS,
  type CanonicalOccasion,
} from '@/domain/taxonomy/normalizeTaxonomy';
import {
  CANONICAL_COLOR_FAMILIES,
  type CanonicalColorFamily,
} from '@/domain/taxonomy/taxonomy';
import type { ComfortLevelValue } from '@/domain/recommendation/types';
import type { StylistIntent, StylistInterpretResponse } from './types';

const occasionMatchers: Array<[CanonicalOccasion, RegExp]> = [
  ['wedding', /(wedding|black\s*tie|חתונ|אירוע\s*חתונה)/i],
  ['event', /(gala|formal\s*event|reception|אירוע\s*רשמי|אירוע)/i],
  ['night_out', /(night\s*out|party|club|drinks|מסיב|יציאה|ברים?)/i],
  ['dinner', /(dinner|date\s*night|restaurant|דייט|ארוחת\s*ערב|מסעדה)/i],
  ['work', /(work|office|meeting|business|עבודה|משרד|פגישה)/i],
  ['studies', /(studies|campus|university|school|לימודים|קמפוס|אוניברסיט)/i],
  ['travel', /(travel|trip|flight|vacation|טיול|טיסה|חופשה)/i],
  ['beach', /(beach|pool|resort|ים|בריכה|חוף)/i],
  ['cozy_home', /(home|lounge|cozy|בית|בבית|נוח\s*בבית)/i],
  ['everyday', /(everyday|daily|casual|errands|יום\s*יום|יומיומי|סידורים)/i],
];

const EXCLUSION_RULES: Array<[string[], RegExp]> = [
  [['jeans', 'denim'], /(no|without|בלי|לא)\s+.{0,10}(jeans|denim|ג['׳]ינס)/i],
  [['heel', 'pump', 'stiletto'], /(no|without|בלי|לא)\s+.{0,10}(heels?|pumps?|stiletto|עקבים?)/i],
  [['dress', 'gown'], /(no|without|בלי|לא)\s+.{0,10}(dress|gown|שמלה)/i],
  [['skirt'], /(no|without|בלי|לא)\s+.{0,10}(skirt|חצאית)/i],
  [['sneaker', 'trainer'], /(no|without|בלי|לא)\s+.{0,10}(sneakers?|trainers?|סניקרס?)/i],
  [['shorts'], /(no|without|בלי|לא)\s+.{0,10}(shorts|מכנסיים\s+קצרים)/i],
  [['legging'], /(no|without|בלי|לא)\s+.{0,10}(leggings?|טייץ)/i],
  [['blazer'], /(no|without|בלי|לא)\s+.{0,10}(blazer|בלייזר)/i],
  [['leather'], /(no|without|בלי|לא)\s+.{0,10}(leather|עור)/i],
  [['crop'], /(no|without|בלי|לא)\s+.{0,10}(crop|cropped|קרופ)/i],
];

const ALLOWED_EXCLUDED_KEYWORDS = new Set(
  EXCLUSION_RULES.flatMap(([keywords]) => keywords),
);

const colorMatchers: Array<[CanonicalColorFamily, RegExp]> = [
  ['black', /(black|שחור)/i],
  ['white', /(white|לבן)/i],
  ['grey', /(grey|gray|אפור)/i],
  ['cream', /(cream|שמנת)/i],
  ['beige', /(beige|בז)/i],
  ['brown', /(brown|חום)/i],
  ['navy', /(navy|כחול\s*כהה)/i],
  ['light_blue', /(light\s*blue|תכלת)/i],
  ['blue', /(blue|כחול)/i],
  ['olive', /(olive|זית)/i],
  ['green', /(green|ירוק)/i],
  ['burgundy', /(burgundy|בורדו)/i],
  ['red', /(red|אדום)/i],
  ['pink', /(pink|ורוד)/i],
  ['purple', /(purple|סגול)/i],
  ['yellow', /(yellow|צהוב)/i],
  ['orange', /(orange|כתום)/i],
  ['silver', /(silver|כסוף|כסף)/i],
  ['gold', /(gold|זהב|זהוב)/i],
];

function detectOccasion(message: string): CanonicalOccasion {
  return occasionMatchers.find(([, matcher]) => matcher.test(message))?.[0] ?? 'everyday';
}

function detectColors(message: string): CanonicalColorFamily[] | undefined {
  const colors = colorMatchers
    .filter(([, matcher]) => matcher.test(message))
    .map(([color]) => color)
    .filter((color) => CANONICAL_COLOR_FAMILIES.includes(color));
  return colors.length ? Array.from(new Set(colors)) : undefined;
}

function detectSilhouette(message: string): StylistIntent['silhouette'] {
  if (/(oversized|relaxed|loose|רחב|אוברסייז|משוחרר)/i.test(message)) return 'relaxed';
  if (/(fitted|tight|bodycon|צמוד|מחטב)/i.test(message)) return 'fitted';
  if (/(balanced|מאוזן)/i.test(message)) return 'balanced';
  return 'none';
}

function detectComfort(message: string): ComfortLevelValue | undefined {
  if (/(very\s*comfortable|super\s*comfortable|ממש\s*נוח|הכי\s*נוח)/i.test(message)) {
    return 'very_comfortable';
  }
  if (/(comfortable|comfy|נוח)/i.test(message)) return 'comfortable';
  return undefined;
}

function detectLayer(message: string): boolean | undefined {
  if (/(no\s*(jacket|layer)|בלי\s*(ז'קט|ג'קט|שכבה))/i.test(message)) return false;
  if (/(jacket|layer|cardigan|coat|ז'קט|ג'קט|שכבה|קרדיגן|מעיל)/i.test(message)) return true;
  return undefined;
}

function detectExcludedKeywords(message: string): string[] | undefined {
  const keywords = EXCLUSION_RULES
    .filter(([, matcher]) => matcher.test(message))
    .flatMap(([values]) => values);
  return keywords.length ? Array.from(new Set(keywords)) : undefined;
}

function detectActivity(message: string): StylistIntent['activityLevel'] | undefined {
  if (/(walking|walk\s*a\s*lot|active|הרבה\s*הליכה|הולכת\s*הרבה|פעיל)/i.test(message)) return 'high';
  if (/(sitting|seated|יושב|יושבת|ישיבה)/i.test(message)) return 'low';
  return undefined;
}

function detectEnvironment(message: string): StylistIntent['environment'] | undefined {
  if (/(outdoor|outside|בחוץ|חוץ)/i.test(message)) return 'mostly_outdoor';
  if (/(indoor|inside|בפנים|ממוזג|מזגן)/i.test(message)) return 'mostly_indoor';
  return undefined;
}

export function parseStylistRequest(message: string): StylistInterpretResponse {
  const clean = message.trim();
  const colors = detectColors(clean);
  const exactColors = /(only|just|רק)\s+.{0,35}(black|white|grey|gray|blue|green|red|pink|purple|beige|brown|שחור|לבן|אפור|כחול|ירוק|אדום|ורוד|סגול|בז|חום)/i.test(clean);

  const intent: StylistIntent = {
    occasion: detectOccasion(clean),
    silhouette: detectSilhouette(clean),
    minComfortLevel: detectComfort(clean),
    colorFamilies: colors,
    colorMode: colors ? (exactColors ? 'only' : 'prefer') : undefined,
    requireExtraLayer: detectLayer(clean),
    activityLevel: detectActivity(clean),
    environment: detectEnvironment(clean),
    excludedKeywords: detectExcludedKeywords(clean),
    confidence: clean ? 0.62 : 0.25,
    source: 'deterministic',
  };

  const occasionHe: Record<CanonicalOccasion, string> = {
    everyday: 'יום־יום',
    work: 'עבודה',
    dinner: 'ארוחת ערב / דייט',
    night_out: 'יציאה',
    event: 'אירוע',
    wedding: 'חתונה',
    travel: 'טיול',
    cozy_home: 'בית',
    beach: 'ים / בריכה',
    studies: 'לימודים',
  };
  const occasionEn: Record<CanonicalOccasion, string> = {
    everyday: 'everyday',
    work: 'work',
    dinner: 'dinner / date',
    night_out: 'a night out',
    event: 'an event',
    wedding: 'a wedding',
    travel: 'travel',
    cozy_home: 'home',
    beach: 'the beach / pool',
    studies: 'studies',
  };

  return {
    intent,
    replyHe: `הבנתי — אני מחפש לוק ל${occasionHe[intent.occasion]} מתוך הארון שלך, לפי הסגנון שכבר למדתי.`,
    replyEn: `Got it — I’m looking for a ${occasionEn[intent.occasion]} outfit from your wardrobe, using the style I’ve already learned.`,
  };
}

export function sanitizeStylistIntent(value: unknown): StylistIntent | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const occasion = CANONICAL_OCCASIONS.includes(raw.occasion as CanonicalOccasion)
    ? (raw.occasion as CanonicalOccasion)
    : 'everyday';
  const silhouette = ['fitted', 'balanced', 'relaxed', 'none'].includes(String(raw.silhouette))
    ? (raw.silhouette as StylistIntent['silhouette'])
    : 'none';
  const minComfortLevel = ['less_comfortable', 'neutral', 'comfortable', 'very_comfortable'].includes(String(raw.minComfortLevel))
    ? (raw.minComfortLevel as ComfortLevelValue)
    : undefined;
  const colorFamilies = Array.isArray(raw.colorFamilies)
    ? raw.colorFamilies.filter((color): color is CanonicalColorFamily =>
        CANONICAL_COLOR_FAMILIES.includes(color as CanonicalColorFamily),
      )
    : undefined;

  return {
    occasion,
    silhouette,
    minComfortLevel,
    colorFamilies: colorFamilies?.length ? colorFamilies : undefined,
    colorMode: raw.colorMode === 'only' || raw.colorMode === 'prefer' ? raw.colorMode : undefined,
    requireExtraLayer: typeof raw.requireExtraLayer === 'boolean' ? raw.requireExtraLayer : undefined,
    activityLevel: ['low', 'normal', 'high'].includes(String(raw.activityLevel))
      ? (raw.activityLevel as StylistIntent['activityLevel'])
      : undefined,
    environment: ['mostly_indoor', 'mixed', 'mostly_outdoor'].includes(String(raw.environment))
      ? (raw.environment as StylistIntent['environment'])
      : undefined,
    excludedKeywords: Array.isArray(raw.excludedKeywords)
      ? Array.from(
          new Set(
            raw.excludedKeywords
              .filter((keyword): keyword is string => typeof keyword === 'string')
              .map((keyword) => keyword.trim().toLowerCase())
              .filter((keyword) => ALLOWED_EXCLUDED_KEYWORDS.has(keyword)),
          ),
        )
      : undefined,
    confidence: Math.max(0, Math.min(1, Number(raw.confidence) || 0.7)),
    source: raw.source === 'ai' ? 'ai' : 'deterministic',
  };
}
