/* @ngInject */
export default class DedicatedCloudServicePackBasicOptionActivationConfirmation {
  constructor(
    $q,
    $state,
    Alerter,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.Alerter = Alerter;
  }

  placeOrder() {
    if (this.form.$invalid) {
      return this.$q.when();
    }

    this.orderIsInProgress = true;

    return this.OvhApiOrder.Upgrade().PrivateCloud().V6()
      .upgrade({
        serviceName: `${this.currentService.serviceName}/servicepack`,
        planCode: `pcc-servicepack-${this.nameOfServicePackToOrder}`,
        quantity: 1,
        autoPayWithPreferredPaymentMethod: this.hasDefaultMeansOfPayment,
      }).$promise
      .then(({ order }) => this.$state.go('app.dedicatedClouds.servicePackBasicOptionActivation.confirmation', { orderURL: order.url }))
      .catch((error) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('dedicatedCloud_servicePack_basicOptionActivation_order_failure_message'),
          { errorMessage: error.data.message },
        );

        return this.$state.go('app.dedicatedClouds');
      });
  }
}
