/**
 * Dynamic Mobile Buyback Pricing Engine
 * Calculates final buyback price based on brand, variant, age, condition, defects, and accessories
 */

interface MobilePriceCalculation {
  finalPriceActual: number;
  displayedPrice: number;
  marketingBonus: number;
  breakdown: {
    basePrice: number;
    afterBrandDep: number;
    afterAgeDep: number;
    afterScreenDefects: number;
    afterFunctionalIssues: number;
    afterAccessories: number;
    afterDeviceDetails: number;
    afterVariantBonus: number;
    deductions: {
      brandDep: number;
      ageDep: number;
      screenDefects: number;
      functionalIssues: number;
    };
    additions: {
      accessories: number;
      deviceDetails: number;
      variantBonus: number;
    };
  };
}

// Brand-specific depreciation for mobiles
const MOBILE_BRAND_DEPRECIATION: Record<string, number> = {
  'Apple': 0.05, // Premium resale value
  'Samsung': 0.08,
  'OnePlus': 0.10,
  'Xiaomi': 0.12,
  'Mi': 0.12,
  'Vivo': 0.12,
  'Oppo': 0.12,
  'Realme': 0.15,
  'Google': 0.08,
  'Motorola': 0.15,
  'Nokia': 0.15,
  'Asus': 0.12,
  'Nothing': 0.10,
};

// Age-based depreciation (more aggressive for mobiles)
const MOBILE_AGE_DEPRECIATION: Record<string, number> = {
  '0-3': 0, // Below 3 months
  '3-6': 0.10, // 3-6 months
  '6-11': 0.20, // 6-11 months
  '11+': 0.35, // Above 11 months
};

// Screen/Body defects depreciation
const SCREEN_BODY_DEFECTS: Record<string, number> = {
  'screen_broken_scratch': 0.15,
  'screen_dead_spot_line': 0.20,
  'body_scratch_dent': 0.08,
  'panel_missing_broken': 0.25,
};

// Functional issues depreciation (each issue)
const FUNCTIONAL_ISSUES: Record<string, number> = {
  'front_camera': 0.05,
  'back_camera': 0.08,
  'volume_button': 0.03,
  'finger_touch': 0.20,
  'wifi': 0.06,
  'battery_faulty': 0.15,
  'speaker_faulty': 0.05,
  'power_button': 0.08,
  'charging_port': 0.10,
  'face_sensor': 0.04,
  'silent_button': 0.02,
  'audio_receiver': 0.05,
  'camera_glass_broken': 0.04,
  'bluetooth': 0.04,
  'vibrator': 0.02,
  'microphone': 0.07,
  'proximity_sensor': 0.03,
};

// Accessories bonus (positive additions)
const ACCESSORIES_BONUS: Record<string, number> = {
  'original_charger': 0.02, // 2% bonus
  'original_box': 0.03, // 3% bonus
};

// Device details impact
const DEVICE_DETAILS_IMPACT: Record<string, number> = {
  'can_make_calls_no': 0.25, // Cannot make calls - major issue
  'touch_not_working_no': 0.20, // Touch not working properly
  'screen_not_original': 0.12, // Non-original screen
  'no_warranty': 0.05, // No warranty
  'no_gst_bill': 0.03, // No GST bill
};

// Device details bonus (positive)
const DEVICE_DETAILS_BONUS: Record<string, number> = {
  'under_warranty': 0.08, // Under warranty - significant bonus
  'has_gst_bill': 0.05, // Has valid GST bill
};

/**
 * Calculate dynamic mobile buyback price
 */
export function calculateMobilePrice(
  basePrice: number,
  brandName: string,
  ageCategory: string, // '0-3', '3-6', '6-11', '11+'
  variantMultiplier: number, // Based on RAM/ROM (e.g., 1.0, 1.2, 1.5)
  screenBodyDefects: string[], // Selected defects
  functionalIssues: string[], // Selected functional issues
  accessories: string[], // Selected accessories
  deviceDetails: {
    canMakeCalls: boolean;
    touchWorking: boolean;
    originalScreen: boolean;
    underWarranty: boolean;
    hasGstBill: boolean;
  }
): MobilePriceCalculation {
  // 1. Apply variant multiplier to base price
  const adjustedBasePrice = basePrice * variantMultiplier;

  // 2. Brand Depreciation
  const brandDep = MOBILE_BRAND_DEPRECIATION[brandName] || 0.12;
  const priceAfterBrand = adjustedBasePrice * (1 - brandDep);

  // 3. Age Depreciation (cumulative)
  const ageDepRate = MOBILE_AGE_DEPRECIATION[ageCategory] || 0.20;
  const priceAfterAge = priceAfterBrand * (1 - ageDepRate);

  // 4. Screen/Body Defects Depreciation (cumulative)
  let screenDefectsRate = 0;
  screenBodyDefects.forEach((defect) => {
    screenDefectsRate += SCREEN_BODY_DEFECTS[defect] || 0;
  });
  screenDefectsRate = Math.min(screenDefectsRate, 0.50); // Cap at 50%
  const priceAfterScreenDefects = priceAfterAge * (1 - screenDefectsRate);

  // 5. Functional Issues Depreciation (cumulative)
  let functionalIssuesRate = 0;
  functionalIssues.forEach((issue) => {
    functionalIssuesRate += FUNCTIONAL_ISSUES[issue] || 0;
  });
  functionalIssuesRate = Math.min(functionalIssuesRate, 0.60); // Cap at 60%
  const priceAfterFunctional = priceAfterScreenDefects * (1 - functionalIssuesRate);

  // 6. Device Details Impact (deductions)
  let deviceDetailsDeduction = 0;
  if (!deviceDetails.canMakeCalls) {
    deviceDetailsDeduction += DEVICE_DETAILS_IMPACT['can_make_calls_no'];
  }
  if (!deviceDetails.touchWorking) {
    deviceDetailsDeduction += DEVICE_DETAILS_IMPACT['touch_not_working_no'];
  }
  if (!deviceDetails.originalScreen) {
    deviceDetailsDeduction += DEVICE_DETAILS_IMPACT['screen_not_original'];
  }
  if (!deviceDetails.underWarranty) {
    deviceDetailsDeduction += DEVICE_DETAILS_IMPACT['no_warranty'];
  }
  if (!deviceDetails.hasGstBill) {
    deviceDetailsDeduction += DEVICE_DETAILS_IMPACT['no_gst_bill'];
  }
  deviceDetailsDeduction = Math.min(deviceDetailsDeduction, 0.40); // Cap at 40%
  const priceAfterDeviceDetails = priceAfterFunctional * (1 - deviceDetailsDeduction);

  // 7. Accessories Bonus (positive additions)
  let accessoriesBonus = 0;
  accessories.forEach((accessory) => {
    accessoriesBonus += ACCESSORIES_BONUS[accessory] || 0;
  });
  const priceAfterAccessories = priceAfterDeviceDetails * (1 + accessoriesBonus);

  // 8. Device Details Bonus (positive additions)
  let deviceDetailsBonus = 0;
  if (deviceDetails.underWarranty) {
    deviceDetailsBonus += DEVICE_DETAILS_BONUS['under_warranty'];
  }
  if (deviceDetails.hasGstBill) {
    deviceDetailsBonus += DEVICE_DETAILS_BONUS['has_gst_bill'];
  }
  const priceAfterBonus = priceAfterAccessories * (1 + deviceDetailsBonus);

  // 9. Final Price Calculation
  const finalPriceActual = Math.max(priceAfterBonus, adjustedBasePrice * 0.20); // Minimum 20% of base

  // 10. Marketing Bonus (for display)
  let marketingBonus = 0;
  if (finalPriceActual < 10000) {
    marketingBonus = 300;
  } else if (finalPriceActual < 30000) {
    marketingBonus = 500;
  } else if (finalPriceActual < 50000) {
    marketingBonus = 1000;
  } else {
    marketingBonus = 1500;
  }

  const displayedPrice = finalPriceActual + marketingBonus;

  return {
    finalPriceActual: Math.round(finalPriceActual),
    displayedPrice: Math.round(displayedPrice),
    marketingBonus,
    breakdown: {
      basePrice: Math.round(adjustedBasePrice),
      afterBrandDep: Math.round(priceAfterBrand),
      afterAgeDep: Math.round(priceAfterAge),
      afterScreenDefects: Math.round(priceAfterScreenDefects),
      afterFunctionalIssues: Math.round(priceAfterFunctional),
      afterAccessories: Math.round(priceAfterAccessories),
      afterDeviceDetails: Math.round(priceAfterBonus),
      afterVariantBonus: Math.round(adjustedBasePrice),
      deductions: {
        brandDep: Math.round(adjustedBasePrice * brandDep),
        ageDep: Math.round(priceAfterBrand * ageDepRate),
        screenDefects: Math.round(priceAfterAge * screenDefectsRate),
        functionalIssues: Math.round(priceAfterScreenDefects * functionalIssuesRate),
      },
      additions: {
        accessories: Math.round(priceAfterDeviceDetails * accessoriesBonus),
        deviceDetails: Math.round(priceAfterAccessories * deviceDetailsBonus),
        variantBonus: Math.round(adjustedBasePrice - basePrice),
      },
    },
  };
}

/**
 * Get age category from months
 */
export function getAgeCategoryFromMonths(months: number): string {
  if (months < 3) return '0-3';
  if (months < 6) return '3-6';
  if (months < 11) return '6-11';
  return '11+';
}

/**
 * Get variant multiplier based on RAM/ROM combination
 */
export function getVariantMultiplier(ram: string, rom: string): number {
  const ramGB = parseInt(ram);
  const romGB = parseInt(rom);
  
  // Base multipliers
  let multiplier = 1.0;
  
  // RAM bonus
  if (ramGB >= 12) multiplier += 0.20;
  else if (ramGB >= 8) multiplier += 0.10;
  else if (ramGB >= 6) multiplier += 0.05;
  else if (ramGB <= 3) multiplier -= 0.05;
  
  // ROM bonus
  if (romGB >= 512) multiplier += 0.15;
  else if (romGB >= 256) multiplier += 0.10;
  else if (romGB >= 128) multiplier += 0.05;
  else if (romGB <= 64) multiplier -= 0.05;
  
  return multiplier;
}

/**
 * Get age category label for display
 */
export function getMobileAgeCategoryLabel(ageCategory: string): string {
  const labels: Record<string, string> = {
    '0-3': 'Below 3 months',
    '3-6': '3 months - 6 months',
    '6-11': '6 months - 11 months',
    '11+': 'Above 11 months',
  };
  return labels[ageCategory] || ageCategory;
}