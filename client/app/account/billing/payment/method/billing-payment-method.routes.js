angular
  .module('Billing')
  .config(($stateProvider, $urlRouterProvider) => {
    const name = 'app.account.billing.payment.method';

    $stateProvider.state(name, {
      url: '/method',
      templateUrl: 'account/billing/payment/method/billing-payment-method.html',
      controller: 'BillingPaymentMethodCtrl',
      controllerAs: '$ctrl',
      translations: { value: ['./'], format: 'json' },
    });

    // add an abstract state that will handle actions on payment method
    $stateProvider.state(`${name}.action`, {
      url: '/:paymentMethodId',
      abstract: true,
    });

    $urlRouterProvider.when(
      /^\/billing\/mean$/,
      ($location, $state) => $state.go(name),
    );
  });
