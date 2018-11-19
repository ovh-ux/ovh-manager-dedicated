import angular from 'angular';

export default /* @ngInject */ ($translate) => {
  const frenchTouch = {
    TTCOnly: false,
    HTOnly: false,
    withTTC: true,
  };

  const usTouch = {
    TTCOnly: false,
    HTOnly: true,
    withTTC: false,
  };

  const deutchTouch = {
    TTCOnly: true,
    HTOnly: false,
    withTTC: true,
  };

  const showTaxes = {
    ASIA: frenchTouch,
    AU: frenchTouch,
    CA: usTouch,
    WE: usTouch,
    WS: usTouch,
    QC: usTouch,
    DE: deutchTouch,
    FI: deutchTouch,
    SN: deutchTouch,
    CZ: frenchTouch,
    ES: frenchTouch,
    FR: frenchTouch,
    GB: frenchTouch,
    IE: frenchTouch,
    IT: frenchTouch,
    LT: frenchTouch,
    MA: frenchTouch,
    NL: frenchTouch,
    PL: frenchTouch,
    PT: frenchTouch,
    SG: usTouch,
    TN: frenchTouch,
    US: usTouch,
  };

  function format(price, paramCountry) {
    const country = (angular.isString(paramCountry) && paramCountry) || 'FR';
    const taxes = showTaxes[country];

    if (price.withTax.value !== 0) {
      if (taxes.TTCOnly) {
        return `<b class="red">${price.withTax.text}</b>`;
      }
      if (taxes.HTOnly) {
        return `<b class="red">${price.withoutTax.text}</b>`;
      }
      return `<b class="red">${$translate.instant('price_ht_label', { price: price.withoutTax.text })}</b><i class="small"> (${$translate.instant('price_ttc_label', { price: price.withTax.text })})</i>`;
    }
    return `<b class="red">${$translate.instant('price_free')}</b>`;
  }

  return function priceFilter(price, ovhSubsidiary) {
    if (price !== undefined) {
      return format(price, ovhSubsidiary);
    }

    return '<span/>';
  };
};
