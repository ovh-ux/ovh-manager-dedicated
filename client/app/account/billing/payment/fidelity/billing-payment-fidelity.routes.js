angular
  .module('Billing')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    'Billing.constants',
    ($stateProvider, $urlRouterProvider, constants) => {
      if (constants.target === 'EU') {
        const name = 'app.account.billing.payment.fidelity';

        $stateProvider.state(name, {
          url: '/fidelity',
          templateUrl: 'account/billing/payment/fidelity/billing-fidelity.html',
          controller: 'Billing.controllers.Fidelity',
        });

        $urlRouterProvider.when(
          /^\/billing\/fidelity/,
          ($location, $state) => $state.go(name),
        );
      }
    }]);
