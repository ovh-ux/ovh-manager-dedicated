export default class BillingPaymentMethodMandatoryForAutorenewCtrl {
  constructor($injector, $uibModalInstance, constants, User) {
  // dependencies injections
    this.$injector = $injector;
    this.$uibModalInstance = $uibModalInstance;

    this.constants = constants;
    this.User = User;
  }

  close() {
    this.$uibModalInstance.close('CLOSING');
  }

  $onInit() {
    this.loading = true;

    return this.$injector.invoke(
    /* @ngTranslationsInject ./translations */
    )
      .then(() => this.User.getUrlOf('guides'))
      .then((guides) => {
        this.autorenewGuide = _.get(guides, 'autoRenew');
        return guides;
      })
      .catch(error => this.$uibModalInstance.dismiss(error))
      .finally(() => {
        this.loading = false;
      });
  }
}
