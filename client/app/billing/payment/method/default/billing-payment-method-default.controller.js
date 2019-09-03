export default class BillingPaymentMethodDefaultCtrl {
  /* @ngInject */

  constructor($uibModalInstance, onDefaultValidate, paymentMethod) {
    // dependencies injections
    this.$uibModalInstance = $uibModalInstance;
    this.onDefaultValidate = onDefaultValidate;
    this.paymentMethod = paymentMethod;

    // other attributes used in view
    this.loading = {
      save: false,
    };
  }

  onPrimaryActionClick() {
    this.loading.save = true;

    const redirectToParams = {
      action: 'default',
    };

    return this.onDefaultValidate()
      .then(() => this.$uibModalInstance.close(_.merge(redirectToParams, {
        paymentMethod: this.paymentMethod,
      })))
      .catch(error => this.$uibModalInstance.dismiss(_.merge(redirectToParams, {
        error,
      })))
      .finally(() => {
        this.loading.save = false;
      });
  }
}
