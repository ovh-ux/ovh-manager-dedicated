import controller from './price.controller';
import template from './price.html';

export default {
  bindings: {
    /**
     * @type {?string} - [FR] Case doesn't matter
     */
    ovhSubsidiary: '<',
    /**
     * @type {?PERIODS} - In the event that the amount is charged periodically
     */
    period: '<',
    /**
     * @type {(PriceDisplay|string)} - Worth 'included' if the price is included
     * with the offer, otherwise is a PriceDisplay.
     * Case doesn't matter
     */
    priceDisplay: '<',
    /**
     * @type {?PRICE_DISPLAY_RULES} - Rules to used instead of the rules of the subsidiary
     */
    rules: '<',
  },
  controller,
  template,
};
