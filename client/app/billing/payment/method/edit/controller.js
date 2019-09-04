export default class BillingPaymentMethodEditCtrl {
  /* @ngInject */
  constructor() {
    // other attribute used in view
    this.loading = {
      save: false,
    };

    this.model = {
      description: null,
    };
  }

  /* =============================
  =            EVENTS            =
  ============================== */

  onPaymentMethodEditFormSubmit() {
    this.loading.save = true;

    const redirectToParams = {
      action: 'edit',
    };

    return this.resolve.onEditFormSubmit(this.model.description)
      .then(() => this.modalInstance.close(_.merge(redirectToParams, {
        description: this.model.description,
        paymentMethod: this.resolve.paymentMethod,
      })))
      .catch(error => this.modalInstance.dismiss(_.merge(redirectToParams, {
        error,
      })))
      .finally(() => {
        this.loading.save = false;
      });
  }

  /* -----  End of EVENTS  ------ */

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    // set model
    this.model.description = this.resolve.paymentMethod.description;
  }

  /* -----  End of Hooks  ------ */
}
