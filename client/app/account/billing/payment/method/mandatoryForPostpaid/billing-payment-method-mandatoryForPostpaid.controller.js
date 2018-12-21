export default class BillingPaymentMethodMandatoryForPostpaidCtrl {
  /* @ngInject */

  constructor($injector, $uibModalInstance) {
    // dependencies injections
    this.$injector = $injector;
    this.$uibModalInstance = $uibModalInstance;
  }

  close() {
    this.$uibModalInstance.close('CLOSING');
  }

  $onInit() {
    this.loading = true;

    return this.$injector.invoke(
      /* @ngTranslationsInject ./translations */
    ).finally(() => {
      this.loading = false;
    });
  }
}
