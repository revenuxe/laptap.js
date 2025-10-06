interface PricingRules {
  age_brackets: Record<string, number>;
  condition_factors: Record<string, number>;
  accessory_factors: Record<string, number>;
  config_premiums: Record<string, number>;
}

interface PriceCalculation {
  basePrice: number;
  ageFactor: number;
  conditionFactor: number;
  accessoryFactor: number;
  configFactor: number;
  finalPrice: number;
  breakdown: {
    base: number;
    ageAdjustment: number;
    conditionAdjustment: number;
    accessoryBonus: number;
    configPremium: number;
  };
}

export function calculatePrice(
  basePrice: number,
  ageMonths: number,
  condition: string,
  accessories: Record<string, boolean>,
  config: Record<string, string>,
  rules: PricingRules,
  minPayoutFloor?: number
): PriceCalculation {
  // Determine age bracket
  let ageFactor = 0.35; // default for 24+
  if (ageMonths <= 3) ageFactor = rules.age_brackets['0-3'] || 0.90;
  else if (ageMonths <= 6) ageFactor = rules.age_brackets['3-6'] || 0.80;
  else if (ageMonths <= 12) ageFactor = rules.age_brackets['6-12'] || 0.67;
  else if (ageMonths <= 24) ageFactor = rules.age_brackets['12-24'] || 0.52;
  else ageFactor = rules.age_brackets['24+'] || 0.35;

  // Get condition factor
  const conditionFactor = rules.condition_factors[condition] || 0.60;

  // Calculate accessory bonuses (additive)
  let accessoryBonus = 0;
  Object.entries(accessories).forEach(([key, value]) => {
    if (value && rules.accessory_factors[key]) {
      accessoryBonus += rules.accessory_factors[key];
    }
  });
  const accessoryFactor = 1 + accessoryBonus;

  // Calculate config premiums (additive)
  let configBonus = 0;
  Object.entries(config).forEach(([key, value]) => {
    const configKey = `${key}_${value}`.toLowerCase().replace(/\s+/g, '_');
    if (rules.config_premiums[configKey]) {
      configBonus += rules.config_premiums[configKey];
    }
  });
  const configFactor = 1 + configBonus;

  // Calculate final price
  let finalPrice = basePrice * ageFactor * conditionFactor * accessoryFactor * configFactor;

  // Apply minimum payout floor if set
  if (minPayoutFloor && finalPrice < minPayoutFloor) {
    finalPrice = minPayoutFloor;
  }

  finalPrice = Math.round(finalPrice);

  return {
    basePrice,
    ageFactor,
    conditionFactor,
    accessoryFactor,
    configFactor,
    finalPrice,
    breakdown: {
      base: basePrice,
      ageAdjustment: Math.round(basePrice * ageFactor - basePrice),
      conditionAdjustment: Math.round(basePrice * ageFactor * conditionFactor - basePrice * ageFactor),
      accessoryBonus: Math.round(basePrice * ageFactor * conditionFactor * accessoryFactor - basePrice * ageFactor * conditionFactor),
      configPremium: Math.round(finalPrice - basePrice * ageFactor * conditionFactor * accessoryFactor),
    },
  };
}

export function getAgeLabel(months: number): string {
  if (months <= 3) return '0-3 months';
  if (months <= 6) return '3-6 months';
  if (months <= 12) return '6-12 months';
  if (months <= 24) return '12-24 months';
  return '24+ months';
}

export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    like_new: 'Like New (Mint)',
    excellent: 'Excellent',
    good: 'Good',
    average: 'Average',
    faulty: 'Faulty / Not Working',
  };
  return labels[condition] || condition;
}
