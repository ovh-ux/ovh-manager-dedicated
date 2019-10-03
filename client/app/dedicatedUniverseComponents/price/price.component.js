import controller from './price.controller';
import template from './price.html';

export default {
  bindings: {
    ovhSubsidiary: '<',
    period: '<',
    /**
     * @type {PriceDisplay|string} - Worth 'included' if the price is included
     * with the offer, otherwise is a PriceDisplay
     */
    priceDisplay: '<',
    rules: '<',
  },
  controller,
  template,
};
