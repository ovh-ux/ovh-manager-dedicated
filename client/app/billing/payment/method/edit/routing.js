
import component from './component';

export default (($stateProvider) => {
  const name = 'app.account.billing.payment.method.action.edit';

  $stateProvider.state(name, {
    url: '/edit',
    component: component.name,
    layout: 'modalResolve',
    resolve: {
      redirectTo: () => 'app.account.billing.payment.method',
      onEditFormSubmit: /* @ngInject */ (
        ovhPaymentMethod,
        paymentMethod,
      ) => description => ovhPaymentMethod.editPaymentMethod(paymentMethod, {
        description,
      }),
    },
  });
});
