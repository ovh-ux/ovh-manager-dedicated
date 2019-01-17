import angular from 'angular';

angular
  .module('Billing')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    'Billing.constants',
    ($stateProvider, $urlRouterProvider, constants) => {
      if (constants.target === 'EU') {
        const name = 'app.account.billing.payment.transactions';

        $stateProvider.state(name, {
          url: '/transactions',
          templateUrl: 'account/billing/payment/transactions/billing-payment-transactions.html',
          controller: 'BillingPaymentTransactionsCtrl',
          controllerAs: '$ctrl',
          translations: ['./'],
        });
      }
    }]);
