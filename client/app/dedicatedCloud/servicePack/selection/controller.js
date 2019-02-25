import _ from 'lodash';

/* @ngInject */
export default class {
  constructor(
    $state,
  ) {
    this.$state = $state;
  }

  $onInit() {
    const currentServicePack = _.find(
      this.servicePacks,
      { name: this.currentService.servicePackName },
    );

    this.orderableServicePacks = this.orderableServicePacks.map((servicePack) => {
      const priceInNumber = _.find(
        this.servicePacks,
        { name: servicePack.name },
      ).price.value - currentServicePack.price.value;
      const price = new Intl
        .NumberFormat(
          'fr',
          {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
          },
        )
        .format(priceInNumber);

      return {
        ...servicePack,
        price: priceInNumber > 0
          ? `+${price}`
          : price,
      };
    });
  }

  goToNextStep() {
    if (this.form.$invalid) {
      return null;
    }

    return this.stepper.goToNextStep({ servicePackToOrder: this.servicePackToOrder });
  }
}
