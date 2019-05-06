import _ from 'lodash';

import {
  MODAL_CONTROLLER_NAME,
  MODAL_TEMPLATE_URL,
} from './constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    $uibModal,
    Alerter,
    servicePackService,
    OvhApiOrder,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.servicePackService = servicePackService;
    this.OvhApiOrder = OvhApiOrder;
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

  selectServicePackToOrder() {
    this.servicePackToOrder = _.find(
      this.orderableServicePacks,
      { name: this.nameOfServicePackToOrder },
    );
  }

  confirmOrder() {
    return this.form.$valid
      ? this.$uibModal
        .open({
          templateUrl: MODAL_TEMPLATE_URL,
          controller: MODAL_CONTROLLER_NAME,
          controllerAs: '$ctrl',
          resolve: {
            optionName: () => this.servicePackToOrder.displayName,
            price: () => this.servicePackToOrder.price.replace(/\+/g, ''),
            priceAsNumber: () => this.servicePackToOrder.priceAsNumber,
          },
        }).result
        .then(() => this.placeOrder())
      : this.$q.when();
  }

  goToNextStep() {
    if (this.form.$invalid) {
      return this.$q.when();
    }

    return this.stepper.goToNextStep({
      currentService: this.currentService,
      servicePackToOrder: this.servicePackToOrder,
    });
  }

  placeOrder() {
    if (this.form.$invalid) {
      return this.$q.when();
    }

    this.orderIsInProgress = true;

    return this.OvhApiOrder.Upgrade().PrivateCloud().v6()
      .post({
        serviceName: `${this.currentService.serviceName}/servicepack`,
        planCode: `pcc-servicepack-${this.servicePackToOrder.name}`,
        quantity: 1,
        autoPayWithPreferredPaymentMethod: this.hasDefaultMeansOfPayment,
      }).$promise
      .then(({ order }) => {
        this.orderingURL = order.url;

        return this.servicePackService
          .savePendingOrder(this.currentService.serviceName, {
            activationType: this.activationType,
            id: order.orderId,
            url: order.url,
            orderedServicePackName: this.servicePackToOrder.name,
          })
          .then(() => (this.hasDefaultMeansOfPayment
            ? this.goToNextStep()
            : null));
      })
      .catch(error => this.stepper
        .exit()
        .then(() => this.Alerter.alertFromSWS(this.$translate.instant('dedicatedCloudDashboardTilesOptionsOrderSelection_order_failure'), {
          message: error.data.message,
          type: 'ERROR',
        }, 'dedicatedCloud_alert')))
      .finally(() => {
        this.orderIsInProgress = false;
      });
  }
}
