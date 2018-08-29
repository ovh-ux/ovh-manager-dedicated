angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.account.billing.main.history.pay-debt', {
    url: '/debt/:debtId/pay',
    views: {
      modal: {
        templateUrl: 'account/billing/main/history/debt/pay/billing-main-history-debt-pay.html',
        controller: 'BillingHistoryDebtPayCtrl',
      },
    },
    layout: {
      name: 'modal',
      redirectTo: 'app.account.billing.main.history',
    },
    translations: ['account/billing/main/history/debt/pay'],
  });
});
