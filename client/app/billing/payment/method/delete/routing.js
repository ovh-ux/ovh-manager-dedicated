
import component from './component';

export default (($stateProvider) => {
  const name = 'app.account.billing.payment.method.action.delete';

  $stateProvider.state(name, {
    url: '/delete',
    component: component.name,
    layout: 'modalTest',
    resolve: {
      redirectTo: () => 'app.account.billing.payment.method',
      onDeleteValidate: /* @ngInject */ (
        ovhPaymentMethod,
        paymentMethod,
      ) => () => ovhPaymentMethod.deletePaymentMethod(paymentMethod),
    },
  });
});
