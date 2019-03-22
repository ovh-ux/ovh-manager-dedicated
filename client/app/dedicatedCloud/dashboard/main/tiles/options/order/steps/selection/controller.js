import _ from 'lodash';

/* @ngInject */
export default class {
  constructor(
    $state,
    $translate,
    Alerter,
    servicePackService,
    OvhApiOrder,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.servicePackService = servicePackService;
    this.OvhApiOrder = OvhApiOrder;
  }

  $onInit() {
    const currentServicePack = _.find(
      this.servicePacksWithPrices,
      { name: this.currentService.servicePackName },
    );

    this.orderableServicePacks = this.orderableServicePacks.map((servicePack) => {
      const matchingServicePack = _.find(this.servicePacksWithPrices, { name: servicePack.name });
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
      };
    });
  }

  goToNextStep() {
    if (this.form.$invalid) {
      return null;
    }

    return this.stepper.goToNextStep({ servicePackToOrder: this.servicePackToOrder });
  }

  placeOrder() {
    if (this.form.$invalid) {
      return null;
    }

    this.orderIsInProgress = true;

    return this.OvhApiOrder.Upgrade().PrivateCloud().v6()
      .post({
        serviceName: `${this.currentService.serviceName}/servicepack`,
        planCode: `pcc-servicepack-${this.servicePackToOrder.name}`,
        quantity: 1,
        autoPayWithPreferredPaymentMethod: false,
      }).$promise
      .then(({ order }) => {
        this.orderIsInProgress = false;
        this.orderingURL = order.url;
        return this.servicePackService.savePendingOrder(
          this.currentService.serviceName,
          {
            activationType: this.activationType,
            id: order.orderId,
            url: order.url,
            orderedServicePackName: this.servicePackToOrder.name,
          },
        );
      })
      .catch(error => this.stepper
        .exit()
        .then(() => this.Alerter.alertFromSWS(
          this.$translate.instant('dedicatedCloudDashboardTilesOptionsOrderSelection_order_failure'),
          {
            message: error.data.message,
            type: 'ERROR',
          },
        )));
  }
}
