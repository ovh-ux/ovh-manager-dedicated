import controller from './billing-payment-method-edit.controller';
import template from './billing-payment-method-edit.html';

angular
  .module('Billing')
  .config(($stateProvider) => {
    const name = 'app.account.billing.payment.method.action.edit';

    $stateProvider.state(name, {
      url: '/edit',
      template,
      controller,
      controllerAs: '$ctrl',
      layout: 'modalTest',
      resolve: {
        redirectTo: () => 'app.account.billing.payment.method',
        onEditFormSubmit: /* @ngInject */ (
          ovhPaymentMethod,
          paymentMethod,
        ) => description => ovhPaymentMethod.editPaymentMethod(paymentMethod, {
          description,
        }),
      },
      translations: { value: ['./'], format: 'json' },
    });
  });
