angular.module('Billing.controllers').controller('PaymentMethodAddCtrl', class PaymentMethodAddCtrl {
  constructor($state, $stateParams) {
    this.$state = $state;
    this.$stateParams = $stateParams;
  }

  onBillingMehtodAddChange() {
    if (this.$stateParams.from) {
      this.$state.go(this.$stateParams.from);
    }
  }
});
