import angular from 'angular';

export default /* @ngInject */ ($translate) => {
  const frenchTouch = {
    TTCOnly: false,
    HTOnly: false,
    withTTC: true,
    withGST: false,
  };

  const usTouch = {
    TTCOnly: false,
    HTOnly: true,
    withTTC: false,
    withGST: false,
  };

  const deutchTouch = {
    TTCOnly: true,
    HTOnly: false,
    withTTC: true,
    withGST: false,
  };

  const asiaTouch = {
    TTCOnly: false,
    HTOnly: false,
    withTTC: false,
    withGST: true,
  };

  const showTaxes = {
    ASIA: asiaTouch,
    AU: asiaTouch,
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
    SG: asiaTouch,
    TN: frenchTouch,
    US: usTouch,
  };

  function format(price, paramCountry) {
    const country = (angular.isString(paramCountry) && paramCountry) || 'FR';
    const taxes = showTaxes[country];
    if (price.withTax.value !== 0) {
      if (taxes.withGST) {
        return `<span class="font-weight-bold red">${$translate.instant('price_price_gst_excl_label', { price: price.withoutTax.text })}</span><span class="font-italic small"> (${$translate.instant('price_price_gst_incl_label', { price: price.withTax.text })})</span>`;
      }
      if (taxes.TTCOnly) {
        return `<span class="font-weight-bold red">${price.withTax.text}</span>`;
      }
      if (taxes.HTOnly) {
        return `<span class="font-weight-bold red">${price.withoutTax.text}</span>`;
      }
      return `<span class="font-weight-bold red">${$translate.instant('price_ht_label', { price: price.withoutTax.text })}</span><span class="font-italic small"> (${$translate.instant('price_ttc_label', { price: price.withTax.text })})</span>`;
    }
    return `<span class="font-weight-bold red">${$translate.instant('price_free')}</span>`;
  }

  return function priceFilter(price, ovhSubsidiary) {
    if (price !== undefined) {
      return format(price, ovhSubsidiary);
    }

    return '<span/>';
  };
};
