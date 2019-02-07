/* @ngInject */
export default class DedicatedCloudServicePackBasicOptionActivationCtrl {
  constructor(
    $q,
    $translate,
    OvhApiOrder,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiOrder = OvhApiOrder;
  }

  $onInit() {
    this.orderIsValid = true;
  }

  placeOrder() {
    if (this.form.$invalid) {
      return this.$q.when();
    }

    this.orderIsInProgress = true;
    this.orderIsValid = true;

    return this.OvhApiOrder.Upgrade().PrivateCloud().V6()
      .upgrade({
        serviceName: `${this.currentService.serviceName}/servicepack`,
        planCode: `pcc-servicepack-${this.servicePackToOrder}`,
        quantity: 1,
      }).$promise
      .then(() => {
        this.orderIsSuccessful = true;
      })
      .catch((err) => {
        this.errorMessage = this.$translate.instant('dedicatedCloud_servicePack_basicOptionActivation_order_failure_message', { errorMessage: err.data.message });
        this.orderIsValid = false;
      })
      .finally(() => {
        this.orderIsInProgress = false;
      });
  }
}
