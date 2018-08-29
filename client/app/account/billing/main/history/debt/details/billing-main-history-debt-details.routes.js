angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.account.billing.main.history.debt.details', {
    url: '/details',
    templateUrl: 'account/billing/main/history/debt/details/billing-main-history-debt-details.html',
    controller: 'BillingHistoryDebtDetailsCtrl',
    controllerAs: '$ctrl',
    translations: ['account/billing/main/history/debt/details'],
  });
});
