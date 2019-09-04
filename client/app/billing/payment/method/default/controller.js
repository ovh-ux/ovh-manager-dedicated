export default class BillingPaymentMethodDefaultCtrl {
  /* @ngInject */

  constructor() {
    // other attributes used in view
    this.loading = {
      save: false,
    };
  }

  /* =============================
  =            Events            =
  ============================== */

  onPrimaryActionClick() {
    this.loading.save = true;

    const redirectToParams = {
      action: 'default',
    };

    return this.resolve.onDefaultValidate()
      .then(() => this.modalInstance.close(_.merge(redirectToParams, {
        paymentMethod: this.resolve.paymentMethod,
      })))
      .catch(error => this.modalInstance.dismiss(_.merge(redirectToParams, {
        error,
      })))
      .finally(() => {
        this.loading.save = false;
      });
  }

  /* -----  End of Events  ------ */
}
