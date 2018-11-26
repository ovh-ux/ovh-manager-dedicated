angular.module('Billing.controllers').controller('Billing.controllers.AutoRenew.WarnPaymentMean', class {
  constructor($scope, $state) {
    this.$scope = $scope;
    this.$state = $state;
  }

  close() {
    this.$scope.setAction();
  }

  goToAddPaymentMean() {
    this.$state.go('app.account.billing.payment.meanAdd').then(() => this.$scope.setAction());
  }
});
