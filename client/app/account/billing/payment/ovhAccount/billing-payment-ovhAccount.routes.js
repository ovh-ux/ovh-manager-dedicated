angular
  .module('Billing')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    'Billing.constants',
    ($stateProvider, $urlRouterProvider, constants) => {
      if (constants.target === 'EU' || constants.target === 'CA') {
        const name = 'app.account.billing.payment.ovhaccount';

        $stateProvider.state(name, {
          url: '/ovhaccount',
          templateUrl: 'account/billing/payment/ovhAccount/billing-ovhAccount.html',
          controller: 'Billing.controllers.OvhAccount',
        });

        $urlRouterProvider.when(
          /^\/billing\/ovhaccount/,
          ($location, $state) => $state.go(name),
        );
      }
    }]);
