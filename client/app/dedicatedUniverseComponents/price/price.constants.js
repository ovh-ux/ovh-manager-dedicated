export const DEFAULT_OVH_SUBSIDIARY = 'FR';

// values are written in ISO8601 as this is easier to handle than text
export const PERIODS = {
  annualy: 'P1Y',
  daily: 'P1D',
  hourly: 'PT1H',
  monthly: 'P1M',
};

/**
 * @typedef {string} PriceDisplayTypes
 */

/**
 * Types of prices that the component can display
 * @readonly
 * @enum {PriceDisplayTypes}
 */
export const PRICE_DISPLAY_TYPES = {
  included: 'included',
  withTax: 'withTax',
  withoutTax: 'withoutTax',
};

export const PRICE_DISPLAY_RULES = {
  all: {
    name: 'all',
    primary: PRICE_DISPLAY_TYPES.withoutTax,
    secondary: PRICE_DISPLAY_TYPES.withTax,
  },
  included: {
    name: 'included',
    primary: PRICE_DISPLAY_TYPES.included,
  },
  onlyWithoutTax: {
    name: 'onlyWithoutTax',
    primary: PRICE_DISPLAY_TYPES.withoutTax,
  },
  onlyWithTax: {
    name: 'onlyWithTax',
    primary: PRICE_DISPLAY_TYPES.withTax,
  },
};

export const TAX_TYPES = {
  // Goods and Services Tax
  gst: 'gst',
  // Value-Added Tax
  vat: 'vat',
};

export const KB_BY_SUB = {
  ASIA: {
    rules: PRICE_DISPLAY_RULES.all.name,
    taxType: TAX_TYPES.gst,
  },
  AU: {
    rules: PRICE_DISPLAY_RULES.all.name,
    taxType: TAX_TYPES.gst,
  },
  CA: {
    rules: PRICE_DISPLAY_RULES.onlyWithoutTax.name,
    taxType: TAX_TYPES.vat,
  },
  CZ: {
    rules: PRICE_DISPLAY_RULES.all.name,
    taxType: TAX_TYPES.vat,
  },
  DE: {
    rules: PRICE_DISPLAY_RULES.onlyWithTax.name,
    taxType: TAX_TYPES.vat,
  },
  ES: {
    rules: PRICE_DISPLAY_RULES.all.name,
    taxType: TAX_TYPES.vat,
  },
  FI: {
    rules: PRICE_DISPLAY_RULES.onlyWithTax.name,
    taxType: TAX_TYPES.vat,
  },
  FR: {
    rules: PRICE_DISPLAY_RULES.all.name,
    taxType: TAX_TYPES.vat,
  },
  GB: {
    rules: PRICE_DISPLAY_RULES.all.name,
    taxType: TAX_TYPES.vat,
  },
  IE: {
    rules: PRICE_DISPLAY_RULES.all.name,
    taxType: TAX_TYPES.vat,
  },
  IT: {
    rules: PRICE_DISPLAY_RULES.all.name,
    taxType: TAX_TYPES.vat,
  },
  LT: {
    rules: PRICE_DISPLAY_RULES.all.name,
    taxType: TAX_TYPES.vat,
  },
  MA: {
    rules: PRICE_DISPLAY_RULES.all.name,
    taxType: TAX_TYPES.vat,
  },
  NL: {
    rules: PRICE_DISPLAY_RULES.all.name,
    taxType: TAX_TYPES.vat,
  },
  PL: {
    rules: PRICE_DISPLAY_RULES.all.name,
    taxType: TAX_TYPES.vat,
  },
  PT: {
    rules: PRICE_DISPLAY_RULES.all.name,
    taxType: TAX_TYPES.vat,
  },
  QC: {
    rules: PRICE_DISPLAY_RULES.onlyWithoutTax.name,
    taxType: TAX_TYPES.vat,
  },
  SG: {
    rules: PRICE_DISPLAY_RULES.all.name,
    taxType: TAX_TYPES.gst,
  },
  SN: {
    rules: PRICE_DISPLAY_RULES.onlyWithTax.name,
    taxType: TAX_TYPES.vat,
  },
  TN: {
    rules: PRICE_DISPLAY_RULES.all.name,
    taxType: TAX_TYPES.vat,
  },
  US: {
    rules: PRICE_DISPLAY_RULES.onlyWithoutTax.name,
    taxType: TAX_TYPES.vat,
  },
  WE: {
    rules: PRICE_DISPLAY_RULES.onlyWithoutTax.name,
    taxType: TAX_TYPES.vat,
  },
  WS: {
    rules: PRICE_DISPLAY_RULES.onlyWithoutTax.name,
    taxType: TAX_TYPES.vat,
  },
};

export default {
  DEFAULT_OVH_SUBSIDIARY,
  KB_BY_SUB,
  PERIODS,
  PRICE_DISPLAY_RULES,
  PRICE_DISPLAY_TYPES,
  TAX_TYPES,
};
