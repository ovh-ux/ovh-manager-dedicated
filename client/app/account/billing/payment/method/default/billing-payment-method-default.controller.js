export default class BillingPaymentMethodDefaultCtrl {
  constructor($injector, $q, $uibModalInstance, payementMethodToEdit, ovhPaymentMethod) {
    /* @ngInject */

    // dependencies injections
    this.$injector = $injector;
    this.$q = $q;
    this.$uibModalInstance = $uibModalInstance;
    this.payementMethodToEdit = payementMethodToEdit;
    this.ovhPaymentMethod = ovhPaymentMethod;

    // other attributes used in view
    this.loading = {
      translations: false,
      save: false,
    };
  }

  onPrimaryActionClick() {
    this.loading.save = true;

    let promise = this.$q.when(true);

    // is it an old payment mean
    if (this.payementMethodToEdit.original) {
      promise = this.ovhPaymentMethod
        .setPayementMethodAsDefault(this.payementMethodToEdit.original);
    }

    return promise
      .then(() => this.$uibModalInstance.close('OK'))
      .catch(error => this.$uibModalInstance.dismiss(error)).finally(() => {
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
