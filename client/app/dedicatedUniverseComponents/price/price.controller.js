import {
  PERIODS,
} from './price.constants';

import PriceService from './price.service';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    ducPriceService,
    ducPriceDisplayService,
  ) {
    this.$translate = $translate;
    this.ducPriceService = ducPriceService;
    this.ducPriceDisplayService = ducPriceDisplayService;
  }

  $onInit() {
    this.computeInputs();
    this.computeBindings();
  }

  computeInputs() {
    this.input = {
      ovhSubsidiary: PriceService.getOvhSubsidiaryOrDefault(this.ovhSubsidiary),
      period: this.period && PriceService.getPeriod(this.period),
      priceDisplay: this.ducPriceDisplayService.computePriceDisplay(this.priceDisplay),
    };

    this.input.rules = this.rules
        || PriceService.getRules(this.input.ovhSubsidiary, this.input.priceDisplay);
  }

  computeBindings() {
    this.bindings = {
      period: this.computePeriod(),
      primary: this.computePrimary(),
      secondary: this.computeSecondary(),
    };
  }

  computePeriod() {
    return {
      exists: this.input.period !== PERIODS.none,
      value: this.input.period,
    };
  }

  computePrimary() {
    const primary = this.input.priceDisplay[_.camelCase(this.input.rules.primary)];

    return {
      ...primary,
      text: this.ducPriceService.translateTextWithPrice(
        this.input.rules.primary,
        primary.text,
        this.input.period,
      ),
    };
  }

  computeSecondary() {
    const exists = _.isString(this.input.rules.secondary);
    const secondary = exists
      && this.input.priceDisplay[_.camelCase(this.input.rules.secondary)];

    return {
      exists,
      ...(exists && secondary),
      text: exists
        && this.ducPriceService.translateTextWithPrice(
          this.input.rules.secondary,
          secondary.text,
          this.input.period,
        ),
    };
  }
}
