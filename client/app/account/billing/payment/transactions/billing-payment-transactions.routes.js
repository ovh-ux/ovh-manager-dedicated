angular
  .module('Billing')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    'coreConfigProvider',
    ($stateProvider, $urlRouterProvider, coreConfigProvider) => {
      if (coreConfigProvider.getRegion() === 'EU') {
        const name = 'app.account.billing.payment.transactions';

        $stateProvider.state(name, {
          url: '/transactions',
          templateUrl: 'account/billing/payment/transactions/billing-payment-transactions.html',
          controller: 'BillingPaymentTransactionsCtrl',
          controllerAs: '$ctrl',
          translations: { value: ['./'], format: 'json' },
        });
      }
    }]);
