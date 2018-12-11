export default class BillingPaymentMethodDefaultCtrl {
  constructor($injector, $q, $uibModalInstance, paymentMethodToEdit, ovhPaymentMethod) {
    /* @ngInject */

    // dependencies injections
    this.$injector = $injector;
    this.$q = $q;
    this.$uibModalInstance = $uibModalInstance;
    this.paymentMethodToEdit = paymentMethodToEdit;
    this.ovhPaymentMethod = ovhPaymentMethod;

    // other attributes used in view
    this.loading = {
      translations: false,
      save: false,
    };
  }

  onPrimaryActionClick() {
    this.loading.save = true;

    return this.ovhPaymentMethod
      .setPaymentMethodAsDefault(this.paymentMethodToEdit)
      .then(() => this.$uibModalInstance.close('OK'))
      .catch(error => this.$uibModalInstance.dismiss(error))
      .finally(() => {
        this.loading.save = false;
      });
  }

  $onInit() {
    this.loading.translations = true;

    return this.$injector.invoke(
      /* @ngTranslationsInject ./translations */
    ).finally(() => {
      this.loading.translations = false;
    });
  }
}
