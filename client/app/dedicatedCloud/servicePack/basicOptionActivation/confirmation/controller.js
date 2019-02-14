/* @ngInject */
export default class DedicatedCloudServicePackBasicOptionActivationConfirmation {
  constructor(
    $q,
    $state,
    $translate,
    Alerter,
    OvhApiOrder,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.OvhApiOrder = OvhApiOrder;
  }

  $onInit() {
    if (this.servicePackToOrder == null) {
      return this.$state.go('app.dedicatedClouds.servicePackBasicOptionActivation.selection');
    }

    return this.$q.when();
  }

  placeOrder() {
    this.orderIsInProgress = true;

    return this.OvhApiOrder.Upgrade().PrivateCloud().V6()
      .upgrade({
        serviceName: `${this.currentService.serviceName}/servicepack`,
        planCode: `pcc-servicepack-${this.servicePackToOrder.name}`,
        quantity: 1,
        autoPayWithPreferredPaymentMethod: this.hasDefaultMeansOfPayment,
      }).$promise
      .then(({ order }) => this.$state.go(
        'app.dedicatedClouds.servicePackBasicOptionActivation.summary',
        {
          orderURL: order.url,
          orderedServicePack: this.servicePackToOrder,
        },
      ))
      .catch(error => this.$state.go('app.dedicatedClouds')
        .then(() => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('dedicatedCloud_servicePack_basicOptionActivation_order_failure_message'),
            {
              message: error.data.message,
              type: 'ERROR',
            },
          );
        }));
  }
}
