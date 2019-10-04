export const TRANSLATION_PREFIX = 'duc_price_';
export const DEFAULT_OVH_SUBSIDIARY = 'FR';

/**
 * @typedef {string} PERIODS
 * ISO8601 values easier to handle than text
 */

/**
 * In the event that the amount is charged periodically
 * @readonly
 * @enum {PERIODS}
 */
export const PERIODS = {
  ANNUALY: 'P1Y',
  DAILY: 'P1D',
  HOURLY: 'PT1H',
  MONTHLY: 'P1M',
  NONE: 'NONE',
};

/**
 * @typedef {string} PRICE_DISPLAY_TYPES
 */

/**
 * Types of prices that the component can display
 * @readonly
 * @enum {PRICE_DISPLAY_TYPES}
 */
export const PRICE_DISPLAY_TYPES = {
  INCLUDED: 'INCLUDED',
  WITH_TAX: 'WITH_TAX',
  WITHOUT_TAX: 'WITHOUT_TAX',
};

export const PRICE_DISPLAY_RULES = {
  ALL: {
    name: 'ALL',
    primary: PRICE_DISPLAY_TYPES.WITHOUT_TAX,
    secondary: PRICE_DISPLAY_TYPES.WITH_TAX,
  },
  INCLUDED: {
    name: 'INCLUDED',
    primary: PRICE_DISPLAY_TYPES.INCLUDED,
  },
  ONLY_WITHOUT_TAX: {
    name: 'ONLY_WITHOUT_TAX',
    primary: PRICE_DISPLAY_TYPES.WITHOUT_TAX,
  },
  ONLY_WITH_TAX: {
    name: 'ONLY_WITH_TAX',
    primary: PRICE_DISPLAY_TYPES.WITH_TAX,
  },
};

export const TAX_TYPES = {
  // Goods and Services Tax
  GST: 'GST',
  // Value-Added Tax
  VAT: 'VAT',
};

export const KB_BY_SUB = {
  ASIA: {
    rules: PRICE_DISPLAY_RULES.ALL.name,
    taxType: TAX_TYPES.gst,
  },
  AU: {
    rules: PRICE_DISPLAY_RULES.ALL.name,
    taxType: TAX_TYPES.gst,
  },
  CA: {
    rules: PRICE_DISPLAY_RULES.ONLY_WITHOUT_TAX.name,
    taxType: TAX_TYPES.vat,
  },
  CZ: {
    rules: PRICE_DISPLAY_RULES.ALL.name,
    taxType: TAX_TYPES.vat,
  },
  DE: {
    rules: PRICE_DISPLAY_RULES.ONLY_WITH_TAX.name,
    taxType: TAX_TYPES.vat,
  },
  ES: {
    rules: PRICE_DISPLAY_RULES.ALL.name,
    taxType: TAX_TYPES.vat,
  },
  FI: {
    rules: PRICE_DISPLAY_RULES.ONLY_WITH_TAX.name,
    taxType: TAX_TYPES.vat,
  },
  FR: {
    rules: PRICE_DISPLAY_RULES.ALL.name,
    taxType: TAX_TYPES.vat,
  },
  GB: {
    rules: PRICE_DISPLAY_RULES.ALL.name,
    taxType: TAX_TYPES.vat,
  },
  IE: {
    rules: PRICE_DISPLAY_RULES.ALL.name,
    taxType: TAX_TYPES.vat,
  },
  IT: {
    rules: PRICE_DISPLAY_RULES.ALL.name,
    taxType: TAX_TYPES.vat,
  },
  LT: {
    rules: PRICE_DISPLAY_RULES.ALL.name,
    taxType: TAX_TYPES.vat,
  },
  MA: {
    rules: PRICE_DISPLAY_RULES.ALL.name,
    taxType: TAX_TYPES.vat,
  },
  NL: {
    rules: PRICE_DISPLAY_RULES.ALL.name,
    taxType: TAX_TYPES.vat,
  },
  PL: {
    rules: PRICE_DISPLAY_RULES.ALL.name,
    taxType: TAX_TYPES.vat,
  },
  PT: {
    rules: PRICE_DISPLAY_RULES.ALL.name,
    taxType: TAX_TYPES.vat,
  },
  QC: {
    rules: PRICE_DISPLAY_RULES.ONLY_WITHOUT_TAX.name,
    taxType: TAX_TYPES.vat,
  },
  SG: {
    rules: PRICE_DISPLAY_RULES.ALL.name,
    taxType: TAX_TYPES.gst,
  },
  SN: {
    rules: PRICE_DISPLAY_RULES.ONLY_WITH_TAX.name,
    taxType: TAX_TYPES.vat,
  },
  TN: {
    rules: PRICE_DISPLAY_RULES.ALL.name,
    taxType: TAX_TYPES.vat,
  },
  US: {
    rules: PRICE_DISPLAY_RULES.ONLY_WITHOUT_TAX.name,
    taxType: TAX_TYPES.vat,
  },
  WE: {
    rules: PRICE_DISPLAY_RULES.ONLY_WITHOUT_TAX.name,
    taxType: TAX_TYPES.vat,
  },
  WS: {
    rules: PRICE_DISPLAY_RULES.ONLY_WITHOUT_TAX.name,
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
  TRANSLATION_PREFIX,
};
