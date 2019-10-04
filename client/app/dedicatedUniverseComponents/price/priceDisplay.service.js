import {
  PRICE_DISPLAY_TYPES,
} from './price.constants';

import Price from './price.class';
import PriceService from './price.service';

export default class PriceDisplayService {
  /* @ngInject */
  constructor(
    $translate,
    ducPriceService,
  ) {
    this.$translate = $translate;
    this.ducPriceService = ducPriceService;
  }

  computePriceDisplay(priceDisplay) {
    PriceService.assertPriceDisplay(priceDisplay);

    return priceDisplay.isIncluded
      ? this.buildDisplayPriceIncluded()
      : priceDisplay;
  }

  buildDisplayPriceIncluded() {
    return {
      [PRICE_DISPLAY_TYPES.included]: new Price(
        this.ducPriceService.translatePriceText(PRICE_DISPLAY_TYPES.included),
        0,
      ),
    };
  }

  buildFromCheckout(checkout) {
    return this.buildFromPrices(checkout.order.prices);
  }

  buildFromPrices(prices) {
    const isIncluded = _.get(prices, 'withTax.value') === 0 || _.get(prices, 'withoutTax.value') === 0;

    if (isIncluded) {
      return this.buildDisplayPriceIncluded();
    }

    return _.reduce(
      _.keys(prices),
      (acc, priceName) => {
        const price = prices[priceName];

        acc[priceName] = new Price(price.text, price.value);

        return acc;
      },
      {},
    );
  }
}
