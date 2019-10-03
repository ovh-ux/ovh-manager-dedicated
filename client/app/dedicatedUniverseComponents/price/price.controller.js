import {
  DEFAULT_OVH_SUBSIDIARY,
  PRICE_DISPLAY_TYPES,
} from './price.constants';

import Price from './price.class';
import PriceService from './price.service';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    ducPriceService,
  ) {
    this.$translate = $translate;
    this.ducPriceService = ducPriceService;
  }

  $onInit() {
    this.ovhSubsidiary = (this.ovhSubsidiary || DEFAULT_OVH_SUBSIDIARY).toUpperCase();
    this.rules = this.rules || PriceService.getRules(this.ovhSubsidiary, this.priceDisplay);
    this.period = _.isString(this.period) && PriceService.getPeriod(this.period);

    if (_.isString(this.priceDisplay)
      && this.priceDisplay.toUpperCase() === PRICE_DISPLAY_TYPES.included.toUpperCase()) {
      this.priceDisplay = {
        [PRICE_DISPLAY_TYPES.included]: new Price(
          this.$translate.instant('duc_price_included'),
          0,
        ),
      };
    }

    this.bindings = {
      period: {
        exists: !!this.period,
        value: this.period,
      },
      primary: this.computePrimary(),
      secondary: this.computeSecondary(),
    };
  }

  computePrimary() {
    const primary = this.priceDisplay[this.rules.primary];

    return {
      ...primary,
      text: this.ducPriceService.translateTextWithPrice(
        this.rules.primary,
        primary.text,
        this.period,
      ),
    };
  }

  computeSecondary() {
    const exists = !!this.rules.secondary;
    const secondary = exists
      && this.priceDisplay[this.rules.secondary];

    return {
      exists,
      ...(exists && secondary),
      text: exists
        && this.ducPriceService.translateTextWithPrice(
          this.rules.secondary,
          secondary.text,
          this.period,
        ),
    };
  }
}
