import {
  KB_BY_SUB,
  PERIODS,
  PRICE_DISPLAY_RULES,
  PRICE_DISPLAY_TYPES,
} from './price.constants';

export default class PriceService {
  /* @ngInject */
  constructor(
    $translate,
  ) {
    this.$translate = $translate;
  }

  static getKB(ovhSubsidiary) {
    if (!_.isString(ovhSubsidiary)) {
      throw new TypeError(`PriceService.getKB: input ovhSubsidiary (${ovhSubsidiary}) is not a string`);
    }

    return KB_BY_SUB[ovhSubsidiary];
  }

  static getPeriod(period) {
    if (!_.isString(period)) {
      throw new TypeError(`PriceService.getKB: input period (${period}) is not a string`);
    }

    const matchingPeriod = PERIODS[period.toLowerCase()];

    return (matchingPeriod || period).toUpperCase();
  }

  static getRules(ovhSubsidiary, priceDisplay) {
    if (!_.isString(ovhSubsidiary)) {
      throw new TypeError(`PriceService.getKB: input ovhSubsidiary (${ovhSubsidiary}) is not a string`);
    }

    if (priceDisplay.toUpperCase() === PRICE_DISPLAY_TYPES.included.toUpperCase()) {
      return PRICE_DISPLAY_RULES.included;
    }

    const rulesName = PriceService.getKB(ovhSubsidiary).rules;
    return PRICE_DISPLAY_RULES[rulesName];
  }

  /**
   * Inserts a price into a translated text reducing the sanitation as the price text is generated
   * by the API and contains special characters
   * @param {string} priceDisplayType -period,  Id of text to translate
   * @param {string} price - Price to display
   */
  translateTextWithPrice(priceDisplayType, price, period) {
    const prefix = 'duc_price';
    const periodText = _.isString(period)
      ? period
      : null;

    const translationId = _.filter(
      [
        prefix,
        priceDisplayType,
        periodText,
      ],
      _.isString,
    )
      .join('_');

    return this
      .$translate
      .instant(
        translationId,
        { price },
        undefined,
        false,
        'escape',
      );
  }
}
