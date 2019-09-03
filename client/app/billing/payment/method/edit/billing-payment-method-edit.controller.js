export default class BillingPaymentMethodEditCtrl {
  /* @ngInject */
  constructor($uibModalInstance, onEditFormSubmit, ovhPaymentMethod, paymentMethod) {
    // dependencies injections
    this.$uibModalInstance = $uibModalInstance;
    this.onEditFormSubmit = onEditFormSubmit;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.paymentMethod = paymentMethod;

    // other attribute used in view
    this.loading = {
      save: false,
    };

    this.model = {
      description: paymentMethod.description,
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

    return this.onEditFormSubmit(this.model.description)
      .then(() => this.$uibModalInstance.close(_.merge(redirectToParams, {
        description: this.model.description,
        paymentMethod: this.paymentMethod,
      })))
      .catch(error => this.$uibModalInstance.dismiss(_.merge(redirectToParams, {
        error,
      })))
      .finally(() => {
        this.loading.save = false;
      });
  }

  /* -----  End of EVENTS  ------ */
}
