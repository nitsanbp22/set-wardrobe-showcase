import type { ClothingItem } from '@/domain/clothing/types';
import type { LayerRecommendation, LayerReason } from '@/domain/recommendation/types';
import {
  THERMAL_TARGETS,
  THERMAL_VALUES,
  PERSONAL_TEMPERATURE_SHIFT,
} from '@/config/thermalThresholds';

/**
 * Selected portfolio sample from SET's private production codebase.
 * The showcase intentionally omits the imported domain/config modules.
 */
export interface WeatherContext {
  temperature: number;
  feelsLike?: number;
  windKph?: number;
  precipitationMm?: number;
  rain?: boolean;
  temperatureLater?: number;
  timeOfDay?: 'morning' | 'day' | 'evening' | 'night';
  userSensitivity?: 'colder' | 'average' | 'warmer';
  environment?: 'mostly_indoor' | 'mixed' | 'mostly_outdoor';
  activityLevel?: 'low' | 'normal' | 'high';
}

function estimateFabricWarmth(material?: string | null): number {
  if (!material) return 0;
  const value = material.toLowerCase();

  if (value.includes('fleece') || value.includes('down') || value.includes('puffer')) return 1.6;
  if (value.includes('wool') || value.includes('cashmere') || value.includes('knit')) return 1.2;
  if (value.includes('leather') || value.includes('suede') || value.includes('velvet')) return 0.8;
  if (value.includes('denim')) return 0.3;
  if (value.includes('silk') || value.includes('satin') || value.includes('chiffon')) return -0.3;
  if (value.includes('linen') || value.includes('mesh')) return -0.8;
  return 0;
}

function estimateItemWarmth(item: ClothingItem): number {
  if (item.temperatureEffect && THERMAL_VALUES[item.temperatureEffect] !== undefined) {
    return THERMAL_VALUES[item.temperatureEffect];
  }

  const subcategory = (item.subcategory ?? '').toLowerCase();
  let warmth = 0;

  if (item.category === 'top') {
    if (subcategory.includes('sweater') || subcategory.includes('knit')) warmth = 1.3;
    else if (subcategory.includes('hoodie') || subcategory.includes('sweatshirt')) warmth = 1.1;
    else if (subcategory.includes('long sleeve') || subcategory.includes('shirt')) warmth = 0.4;
    else if (subcategory.includes('tank') || subcategory.includes('camisole')) warmth = -0.7;
  } else if (item.category === 'bottom') {
    if (subcategory.includes('short') || subcategory.includes('mini')) warmth = -0.6;
    else if (subcategory.includes('jean') || subcategory.includes('trouser')) warmth = 0.4;
    else warmth = 0.2;
  } else if (item.category === 'one_piece') {
    if (subcategory.includes('sweater dress') || subcategory.includes('knit dress')) warmth = 1.2;
    else if (subcategory.includes('sundress') || subcategory.includes('mini')) warmth = -0.5;
  } else if (item.category === 'outerwear') {
    if (subcategory.includes('puffer') || subcategory.includes('parka')) warmth = 2.4;
    else if (subcategory.includes('wool coat')) warmth = 1.9;
    else if (subcategory.includes('trench') || subcategory.includes('leather jacket')) warmth = 1.3;
    else warmth = 1.0;
  }

  return warmth + estimateFabricWarmth(item.material) * 0.5;
}

export function calculateOutfitThermalProfile(items: ClothingItem[]): number {
  const tops = items.filter((item) => item.category === 'top');
  const bottoms = items.filter((item) => item.category === 'bottom');
  const onePieces = items.filter((item) => item.category === 'one_piece');
  const outerwear = items.filter((item) => item.category === 'outerwear');
  const shoes = items.filter((item) => item.category === 'shoes');

  let warmth = 0;

  if (onePieces.length > 0) {
    warmth += estimateItemWarmth(onePieces[0]) * 1.3;
  } else {
    if (tops[0]) warmth += estimateItemWarmth(tops[0]) * 0.9;
    if (bottoms[0]) warmth += estimateItemWarmth(bottoms[0]) * 0.7;
  }

  for (let index = 1; index < tops.length; index += 1) {
    warmth += estimateItemWarmth(tops[index]) * 0.75;
  }

  outerwear.forEach((layer, index) => {
    warmth += Math.max(0.3, estimateItemWarmth(layer)) * (index === 0 ? 0.75 : 0.45);
  });

  if (shoes[0]) warmth += estimateItemWarmth(shoes[0]) * 0.25;

  return Number(warmth.toFixed(2));
}

function getTargetThermal(
  temperature: number,
  sensitivity: 'colder' | 'average' | 'warmer' = 'average'
): number {
  const effectiveTemperature = temperature + PERSONAL_TEMPERATURE_SHIFT[sensitivity];
  const match = THERMAL_TARGETS.find((target) => effectiveTemperature >= target.min);
  return match ? match.target : 1.75;
}

/**
 * Produces a tri-state layering recommendation instead of a binary cold/not-cold flag.
 */
export function determineLayerRecommendation(
  items: ClothingItem[],
  weather?: WeatherContext | null
): { layerStatus: LayerRecommendation; layerReason?: LayerReason; reasons: string[] } {
  if (!weather) return { layerStatus: 'not_needed', reasons: ['WEATHER_NOT_PROVIDED'] };

  const temperature = weather.feelsLike ?? weather.temperature;
  const baseItems = items.filter((item) => item.category !== 'outerwear');
  const baseWarmth = calculateOutfitThermalProfile(baseItems);
  const targetWarmth = getTargetThermal(temperature, weather.userSensitivity);

  if (targetWarmth - baseWarmth >= 0.75) {
    return {
      layerStatus: 'required',
      layerReason: 'thermal_balance',
      reasons: ['LAYER_REQUIRED_COLD'],
    };
  }

  if (
    typeof weather.temperatureLater === 'number' &&
    temperature - weather.temperatureLater >= 4.5 &&
    weather.temperatureLater <= 19
  ) {
    const laterTarget = getTargetThermal(weather.temperatureLater, weather.userSensitivity);
    if (laterTarget - baseWarmth >= 0.45) {
      return {
        layerStatus: 'recommended',
        layerReason: 'temperature_drop',
        reasons: ['LAYER_RECOMMENDED_EVENING_DROP'],
      };
    }
  }

  if ((weather.windKph ?? 0) >= 30 && targetWarmth - baseWarmth >= 0.35) {
    return {
      layerStatus: 'recommended',
      layerReason: 'wind',
      reasons: ['LAYER_RECOMMENDED_WIND'],
    };
  }

  if (weather.environment === 'mostly_indoor' && temperature >= 24 && baseWarmth <= 0.2) {
    return {
      layerStatus: 'recommended',
      layerReason: 'indoor_cooling',
      reasons: ['LAYER_RECOMMENDED_INDOOR_COOLING'],
    };
  }

  return {
    layerStatus: 'not_needed',
    reasons: ['BASE_OUTFIT_SUFFICIENT'],
  };
}
