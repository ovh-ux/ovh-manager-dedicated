export default class BillingPaymentMethodDeleteCtrl {
  /* @ngInject */

  constructor() {
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

    return this.resolve.onDeleteValidate()
      .then(() => this.modalInstance.close(_.merge(redirectToParams, {
        paymentMethod: this.resolve.paymentMethod,
      })))
      .catch(error => this.modalInstance.dismiss(_.merge(redirectToParams, {
        error,
      })))
      .finally(() => {
        this.loading.delete = false;
      });
  }

  /* -----  End of EVENTS  ------ */
}
