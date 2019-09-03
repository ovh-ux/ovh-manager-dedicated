import controller from './billing-payment-method-default.controller';
import template from './billing-payment-method-default.html';

angular
  .module('Billing')
  .config(($stateProvider) => {
    const name = 'app.account.billing.payment.method.action.default';

    $stateProvider.state(name, {
      url: '/default',
      template,
      controller,
      controllerAs: '$ctrl',
      layout: 'modalTest',
      resolve: {
        redirectTo: () => 'app.account.billing.payment.method',
        onDefaultValidate: /* @ngInject */ (
          ovhPaymentMethod,
          paymentMethod,
        ) => () => ovhPaymentMethod.setPaymentMethodAsDefault(paymentMethod),
      },
      translations: { value: ['./'], format: 'json' },
    });
  });
