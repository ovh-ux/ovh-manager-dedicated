import controller from './billing-payment-method-edit.controller';
import template from './billing-payment-method-edit.html';

angular
  .module('Billing')
  .config(($stateProvider, $urlRouterProvider) => {
    const name = 'app.account.billing.payment.method.action.edit';

    $stateProvider.state(name, {
      url: '/edit',
      template,
      controller,
      controllerAs: '$ctrl',
      layout: 'modalTest',
      resolve: {
        redirectTo: () => 'app.account.billing.payment.method',
      },
      translations: { value: ['./'], format: 'json' },
    });
  });
