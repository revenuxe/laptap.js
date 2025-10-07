/**
 * Dynamic Laptop Buyback Pricing Engine
 * Calculates final buyback price based on brand, model, age, condition, specs, and market competition
 */

interface Brand {
  name: string;
  initialDepreciation: number;
}

interface PriceCalculation {
  // Actual price to be paid
  finalPriceActual: number;
  // Marketing price with psychological bonus
  displayedPrice: number;
  // Marketing bonus amount
  marketingBonus: number;
  // Detailed breakdown
  breakdown: {
    basePrice: number;
    afterInitialDep: number;
    afterAgeDep: number;
    afterPhysicalDep: number;
    afterScreenDep: number;
    afterFunctionalDep: number;
    afterSpecAdditions: number;
    competitorPrice: number;
    // Individual deductions
    deductions: {
      initialDep: number;
      ageDep: number;
      physicalDep: number;
      screenDep: number;
      functionalDep: number;
    };
    // Individual additions
    additions: {
      specs: number;
      competitiveBonus: number;
    };
  };
}

// Brand-specific initial depreciation
const BRAND_DEPRECIATION: Record<string, number> = {
  'Apple': 0.075, // 7.5% average (5-10%)
  'Microsoft': 0.075,
  'Dell': 0.125, // 12.5% average (10-15%)
  'HP': 0.125,
  'Lenovo': 0.125,
  'Asus': 0.125,
  'MSI': 0.125,
  'Acer': 0.15,
  'Samsung': 0.125,
};

// Age-based depreciation
const AGE_DEPRECIATION: Record<string, number> = {
  '0-12': 0, // <1 year
  '12-24': 0.15, // 1-2 years
  '24-36': 0.30, // 2-3 years
  '36+': 0.50, // >3 years
};

// Physical condition depreciation
const PHYSICAL_CONDITION_DEPRECIATION: Record<string, number> = {
  'flawless': 0,
  'good': 0.10,
  'average': 0.20,
  'below_average': 0.40,
};

// Screen condition depreciation
const SCREEN_CONDITION_DEPRECIATION: Record<string, number> = {
  'flawless': 0,
  'good': 0.05,
  'average': 0.15,
  'damaged': 0.30,
};

// Functional issues depreciation (cumulative)
const FUNCTIONAL_ISSUES_DEPRECIATION: Record<string, number> = {
  'keyboard': 0.05,
  'trackpad': 0.03,
  'ports': 0.04,
  'wifi': 0.05,
  'speakers': 0.02,
  'webcam': 0.02,
  'overheating': 0.08,
  'battery': 0.10,
  'display_flickering': 0.07,
  'hinge': 0.05,
};

// Spec-based additions (2-5% each)
const SPEC_ADDITIONS: Record<string, number> = {
  // CPU
  'cpu_i3': -0.05,
  'cpu_i5': 0,
  'cpu_i7': 0.03,
  'cpu_i9': 0.05,
  'cpu_ryzen_3': -0.05,
  'cpu_ryzen_5': 0,
  'cpu_ryzen_7': 0.03,
  'cpu_ryzen_9': 0.05,
  'cpu_m1': 0.05,
  'cpu_m2': 0.05,
  'cpu_m3': 0.05,
  
  // RAM
  'ram_4gb': -0.05,
  'ram_8gb': 0,
  'ram_16gb': 0.03,
  'ram_32gb': 0.05,
  'ram_64gb': 0.05,
  
  // Storage
  'storage_128_ssd': -0.03,
  'storage_256_ssd': 0,
  'storage_512_ssd': 0.02,
  'storage_1tb_ssd': 0.04,
  'storage_2tb_ssd': 0.05,
  'storage_hdd': -0.05,
  
  // GPU
  'gpu_integrated': 0,
  'gpu_dedicated': 0.05,
  'gpu_rtx': 0.05,
  
  // Screen size
  'screen_13': 0,
  'screen_14-15': 0.02,
  'screen_16-17': 0.03,
};

/**
 * Calculate dynamic buyback price
 */
export function calculateDynamicPrice(
  basePrice: number,
  brandName: string,
  ageMonths: number,
  physicalCondition: string,
  screenCondition: string,
  functionalIssues: string[],
  specs: {
    cpu?: string;
    ram?: string;
    storage?: string;
    gpu?: string;
    screen_size?: string;
  }
): PriceCalculation {
  // 1. Initial Depreciation based on brand
  const initialDep = BRAND_DEPRECIATION[brandName] || 0.125;
  const priceAfterInitial = basePrice * (1 - initialDep);

  // 2. Age Depreciation (cumulative)
  let ageDepRate = 0;
  if (ageMonths < 12) {
    ageDepRate = AGE_DEPRECIATION['0-12'];
  } else if (ageMonths < 24) {
    ageDepRate = AGE_DEPRECIATION['12-24'];
  } else if (ageMonths < 36) {
    ageDepRate = AGE_DEPRECIATION['24-36'];
  } else {
    ageDepRate = AGE_DEPRECIATION['36+'];
  }
  const priceAfterAge = priceAfterInitial * (1 - ageDepRate);

  // 3. Physical Condition Depreciation (cumulative)
  const physicalDepRate = PHYSICAL_CONDITION_DEPRECIATION[physicalCondition] || 0.20;
  const priceAfterPhysical = priceAfterAge * (1 - physicalDepRate);

  // 4. Screen Condition Depreciation (cumulative)
  const screenDepRate = SCREEN_CONDITION_DEPRECIATION[screenCondition] || 0.15;
  const priceAfterScreen = priceAfterPhysical * (1 - screenDepRate);

  // 5. Functional Issues Depreciation (cumulative)
  let functionalDepRate = 0;
  functionalIssues.forEach((issue) => {
    functionalDepRate += FUNCTIONAL_ISSUES_DEPRECIATION[issue] || 0;
  });
  // Cap functional depreciation at 30%
  functionalDepRate = Math.min(functionalDepRate, 0.30);
  const priceAfterFunctional = priceAfterScreen * (1 - functionalDepRate);

  // 6. Spec-Based Additions (2-5% each)
  let specAdditionRate = 0;
  if (specs.cpu) {
    const cpuKey = `cpu_${specs.cpu.toLowerCase().replace(/\s+/g, '_')}`;
    specAdditionRate += SPEC_ADDITIONS[cpuKey] || 0;
  }
  if (specs.ram) {
    const ramKey = `ram_${specs.ram.toLowerCase().replace(/\s+/g, '_')}`;
    specAdditionRate += SPEC_ADDITIONS[ramKey] || 0;
  }
  if (specs.storage) {
    const storageKey = `storage_${specs.storage.toLowerCase().replace(/\s+/g, '_')}`;
    specAdditionRate += SPEC_ADDITIONS[storageKey] || 0;
  }
  if (specs.gpu) {
    const gpuKey = `gpu_${specs.gpu.toLowerCase().replace(/\s+/g, '_')}`;
    specAdditionRate += SPEC_ADDITIONS[gpuKey] || 0;
  }
  if (specs.screen_size) {
    const screenKey = `screen_${specs.screen_size.toLowerCase().replace(/\s+/g, '_')}`;
    specAdditionRate += SPEC_ADDITIONS[screenKey] || 0;
  }
  
  const priceAfterSpecs = priceAfterFunctional * (1 + specAdditionRate);

  // 7. Competitive Check - ensure we're competitive
  // Simulating competitor prices (in production, this would be fetched from API/database)
  const competitorPrice = basePrice * 0.4; // Assuming competitors offer ~40% of base price
  const competitiveBonus = Math.max(0, competitorPrice + 1000 - priceAfterSpecs);
  const finalPriceActual = Math.max(priceAfterSpecs, competitorPrice + 1000);

  // 8. Marketing Bonus Calculation (for display purposes)
  let marketingBonus = 0;
  if (finalPriceActual < 20000) {
    marketingBonus = 500;
  } else if (finalPriceActual < 50000) {
    marketingBonus = 1000;
  } else {
    marketingBonus = 2000;
  }

  const displayedPrice = finalPriceActual + marketingBonus;

  return {
    finalPriceActual: Math.round(finalPriceActual),
    displayedPrice: Math.round(displayedPrice),
    marketingBonus,
    breakdown: {
      basePrice,
      afterInitialDep: Math.round(priceAfterInitial),
      afterAgeDep: Math.round(priceAfterAge),
      afterPhysicalDep: Math.round(priceAfterPhysical),
      afterScreenDep: Math.round(priceAfterScreen),
      afterFunctionalDep: Math.round(priceAfterFunctional),
      afterSpecAdditions: Math.round(priceAfterSpecs),
      competitorPrice: Math.round(competitorPrice),
      deductions: {
        initialDep: Math.round(basePrice * initialDep),
        ageDep: Math.round(priceAfterInitial * ageDepRate),
        physicalDep: Math.round(priceAfterAge * physicalDepRate),
        screenDep: Math.round(priceAfterPhysical * screenDepRate),
        functionalDep: Math.round(priceAfterScreen * functionalDepRate),
      },
      additions: {
        specs: Math.round(priceAfterFunctional * specAdditionRate),
        competitiveBonus: Math.round(competitiveBonus),
      },
    },
  };
}

/**
 * Get age category label
 */
export function getAgeCategoryLabel(months: number): string {
  if (months < 12) return 'Less than 1 year';
  if (months < 24) return '1-2 years';
  if (months < 36) return '2-3 years';
  return 'More than 3 years';
}

/**
 * Get condition label
 */
export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    'flawless': 'Flawless / Like New',
    'good': 'Good',
    'average': 'Average / Fair',
    'below_average': 'Below Average / Poor',
    'damaged': 'Damaged',
  };
  return labels[condition] || condition;
}
