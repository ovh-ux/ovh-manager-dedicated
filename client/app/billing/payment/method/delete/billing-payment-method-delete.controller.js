export default class BillingPaymentMethodDeleteCtrl {
  /* @ngInject */

  constructor($q, $uibModalInstance, paymentMethod, ovhPaymentMethod) {
    // dependencies injections
    this.$uibModalInstance = $uibModalInstance;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.paymentMethod = paymentMethod;

    // other attribute used in view
    this.loading = {
      delete: false,
    };
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onPrimaryActionClick() {
    this.loading.delete = true;

    const redirectToParams = {
      action: 'delete',
    };

    return this.ovhPaymentMethod
      .deletePaymentMethod(this.paymentMethod)
      .then(() => this.$uibModalInstance.close(_.merge(redirectToParams, {
        paymentMethod: this.paymentMethod,
      })))
      .catch(error => this.$uibModalInstance.dismiss(_.merge(redirectToParams, {
        error,
      })))
      .finally(() => {
        this.loading.delete = false;
      });
  }

  /* -----  End of EVENTS  ------ */
}
