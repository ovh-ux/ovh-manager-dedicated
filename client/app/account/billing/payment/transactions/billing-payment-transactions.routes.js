import angular from 'angular';

angular
  .module('Billing')
  .config(($stateProvider) => {
    $stateProvider.state('app.account.billing.payment.transactions', {
      url: '/transactions',
      templateUrl: 'account/billing/payment/transactions/billing-payment-transactions.html',
      controller: 'BillingPaymentTransactionsCtrl',
      controllerAs: '$ctrl',
      translations: ['./'],
    });
  });
