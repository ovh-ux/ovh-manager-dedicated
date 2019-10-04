import {
  DEFAULT_OVH_SUBSIDIARY,
  KB_BY_SUB,
  PERIODS,
  PRICE_DISPLAY_RULES,
  TRANSLATION_PREFIX,
} from './price.constants';

export default class PriceService {
  /* @ngInject */
  constructor(
    $translate,
  ) {
    this.$translate = $translate;
  }

  static assertPriceDisplay(priceDisplay) {
    if (!_.isObject(priceDisplay)) {
      throw new TypeError(`PriceService.assertOvhSubsidiary: input "ovhSubsidiary" (${this.ovhSubsidiary}) should be an object`);
    }
  }

  static assertOvhSubsidiary(ovhSubsidiary) {
    if (!_.isString(ovhSubsidiary)) {
      throw new TypeError(`PriceService.assertOvhSubsidiary: input "ovhSubsidiary" (${this.ovhSubsidiary}) should be a string`);
    }

    if (KB_BY_SUB[_.snakeCase(ovhSubsidiary).toUpperCase()] == null) {
      throw new RangeError(`PriceService.assertOvhSubsidiary: input "ovhSubsidiary" (${this.ovhSubsidiary}) is not a valid subsidiary`);
    }
  }

  static assertPeriod(period) {
    if (!_.isString(period)) {
      throw new TypeError(`PriceService.assertPeriod: input "period" ( ${period}) should be a string`);
    }

    if (
      PERIODS[_.snakeCase(period).toUpperCase()] == null
      || !_.contains(_.keys(PERIODS), _.snakeCase(period).toUpperCase())
    ) {
      throw new RangeError(`PriceService.assertPeriod: input "period" ( ${period}) is not a valid period`);
    }
  }

  static getKB(ovhSubsidiary) {
    if (!_.isString(ovhSubsidiary)) {
      throw new TypeError(`PriceService.getKB: input ovhSubsidiary (${ovhSubsidiary}) is not a string`);
    }

    return KB_BY_SUB[_.snakeCase(ovhSubsidiary).toUpperCase()];
  }

  static getPeriod(period) {
    PriceService.assertPeriod(period);

    return PERIODS[_.snakeCase(period).toUpperCase()].toUpperCase();
  }

  static getRules(ovhSubsidiary, priceDisplay) {
    if (!_.isString(ovhSubsidiary)) {
      throw new TypeError(`PriceService.getRules: input ovhSubsidiary (${ovhSubsidiary}) is not a string`);
    }

    if (priceDisplay.isIncluded) {
      return PRICE_DISPLAY_RULES.included;
    }

    const rulesName = PriceService.getKB(ovhSubsidiary).rules;
    return PRICE_DISPLAY_RULES[rulesName];
  }

  /**
   * Inserts a price into a translated text reducing the sanitation as the price text is generated
   * by the API and contains special characters
   * @param {PRICE_DISPLAY_TYPES} priceDisplayType - Type of price to display
   * @param {string} price - Price to display
   * @param {PERIODS} period - Period to display
   */
  translateTextWithPrice(priceDisplayType, price, period) {
    const translationId = _.filter(
      [
        priceDisplayType,
        period !== PERIODS.none ? period : null,
      ],
      _.isString,
    )
      .join('_');

    return this.translatePriceText(translationId, price);
  }

  static getOvhSubsidiaryOrDefault(ovhSubsidiary) {
    const computedSub = (`${ovhSubsidiary}` || DEFAULT_OVH_SUBSIDIARY).toUpperCase();

    PriceService.assertOvhSubsidiary(computedSub);

    return computedSub;
  }

  translatePriceText(translationId, price) {
    return this
      .$translate
      .instant(
        `${TRANSLATION_PREFIX}${translationId}`.toLowerCase(),
        { price },
        undefined,
        false,
        'escape',
      );
  }
}
