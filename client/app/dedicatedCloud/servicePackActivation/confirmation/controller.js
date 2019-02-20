/* @ngInject */
export default class DedicatedCloudServicePackCertificationActivationConfirmation {
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
      return this.stepper.goToPreviousStep();
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
      .then(({ order }) => this.stepper.goToNextStep({ orderURL: order.url }))
      .catch(error => this.stepper.exit()
        .then(() => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('dedicatedCloud_certificationActivation_confirmation_order_failure'),
            {
              message: error.data.message,
              type: 'ERROR',
            },
          );
        }));
  }
}
