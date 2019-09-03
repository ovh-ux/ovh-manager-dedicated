import controller from './billing-payment-method-delete.controller';
import template from './billing-payment-method-delete.html';

angular
  .module('Billing')
  .config(($stateProvider) => {
    const name = 'app.account.billing.payment.method.action.delete';

    $stateProvider.state(name, {
      url: '/delete',
      template,
      controller,
      controllerAs: '$ctrl',
      layout: 'modalTest',
      resolve: {
        redirectTo: () => 'app.account.billing.payment.method',
        onDeleteValidate: /* @ngInject */ (
          ovhPaymentMethod,
          paymentMethod,
        ) => () => ovhPaymentMethod.setPaymentMethodAsDefault(paymentMethod),
      },
      translations: { value: ['./'], format: 'json' },
    });
  });
