
import component from './component';

export default (($stateProvider) => {
  const name = 'app.account.billing.payment.method.action.default';

  $stateProvider.state(name, {
    url: '/default',
    component: component.name,
    layout: 'modalTest',
    resolve: {
      redirectTo: () => 'app.account.billing.payment.method',
      onDefaultValidate: /* @ngInject */ (
        ovhPaymentMethod,
        paymentMethod,
      ) => () => ovhPaymentMethod.setPaymentMethodAsDefault(paymentMethod),
    },
  });
});
