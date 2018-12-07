export default class BillingPaymentMethodDeleteCtrl {
  constructor($injector, $q, $uibModalInstance, payementMethodToDelete, ovhPaymentMethod) {
    /* @ngInject */

    // dependencies injections
    this.$injector = $injector;
    this.$q = $q;
    this.$uibModalInstance = $uibModalInstance;
    this.payementMethodToDelete = payementMethodToDelete;
    this.ovhPaymentMethod = ovhPaymentMethod;

    // other attribute used in view
    this.loading = {
      translations: false,
      delete: false,
    };
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onPrimaryActionClick() {
    this.loading.delete = true;

    let promise = this.$q.when(true);

    // is it an old payment mean
    if (this.payementMethodToDelete.original) {
      promise = this.ovhPaymentMethod.deletePaymentMethod(this.payementMethodToDelete.original);
    }

    return promise.then(() => this.$uibModalInstance.close('OK')).catch(error => this.$uibModalInstance.dismiss(error)).finally(() => {
      this.loading.delete = false;
    });
  }

  /* -----  End of EVENTS  ------ */


  /* =====================================
  =            INITIALIZATION            =
  ====================================== */

  $onInit() {
    this.loading.translations = true;

    return this.$injector.invoke(
      /* @ngTranslationsInject ./translations */
    ).finally(() => {
      this.loading.translations = false;
    });
  }

  /* -----  End of INITIALIZATION  ------ */
}
