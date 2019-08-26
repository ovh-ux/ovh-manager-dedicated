import controller from './billing-payment-method-edit.controller';
import template from './billing-payment-method-edit.html';

angular
  .module('Billing')
  .config(($stateProvider, $urlRouterProvider) => {
    const name = 'app.account.billing.payment.method.action.edit';

    $stateProvider.state(name, {
      url: '/edit',
      layout: {
        name: 'modalTest',
        modalOptions: {
          template,
          controller: () => {},
          controllerAs: '$ctrl',
          resolve: {
            redirectTo: () => 'app.account.billing.payment.method',
          },
        },
      },
      translations: { value: ['./'], format: 'json' },
    });
  });
