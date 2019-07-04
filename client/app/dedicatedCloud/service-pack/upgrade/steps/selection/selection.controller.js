import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    Alerter,
    OvhApiOrder,
    ovhManagerPccServicePackService,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.OvhApiOrder = OvhApiOrder;
    this.ovhManagerPccServicePackService = ovhManagerPccServicePackService;
  }

  $onInit() {
    const currentServicePack = _.find(
      this.servicePacksWithPrices,
      { name: this.currentService.servicePackName },
    );

    this.orderableServicePacks = _.sortBy(
      this.orderableServicePacks
        .map((servicePack) => {
          const matchingServicePack = _.find(this.servicePacksWithPrices, {
            name: servicePack.name,
          });
          const priceAsNumber = matchingServicePack.price.value - currentServicePack.price.value;

          const priceAsString = new Intl
            .NumberFormat(
              'fr', // can't change as the API is not ISO compliant
              {
                style: 'currency',
                currency: currentServicePack.price.currencyCode,
                minimumFractionDigits: 2,
              },
            )
            .format(priceAsNumber);

          const price = priceAsNumber > 0 ? `+${priceAsString}` : priceAsString;

          return {
            ...servicePack,
            price,
            priceAsNumber,
          };
        }),
      'name',
    );
  }

  onChangeServicePackPicker(selectedItem) {
    this.servicePackToOrder = selectedItem;
  }
}
