const resolveCurrentService = /* @ngInject */ (
  $transition$,
  DedicatedCloud,
) => $transition$.params().currentService
    || DedicatedCloud.retrievingFullService($transition$.params().productId);

const resolveCurrentUser = /* @ngInject */ (
  $transition$,
  User,
) => $transition$.params().currentUser
  || User.getUser();

const resolveHasDefaultMeansOfPayment = /* @ngInject */ (
  $transition$,
  ovhPaymentMethod,
) => $transition$.params().hasDefaultMeansOfPayment
    || ovhPaymentMethod.hasDefaultPaymentMethod();

const resolveServicePackToOrder = /* @ngInject */ $transition$ => $transition$
  .params().servicePackToOrder;

export default {
  params: {
    currentService: null,
    currentUser: null,
    hasDefaultMeansOfPayment: null,
    servicePackToOrder: null,
  },
  resolve: {
    currentService: resolveCurrentService,
    currentUser: resolveCurrentUser,
    hasDefaultMeansOfPayment: resolveHasDefaultMeansOfPayment,
    servicePackToOrder: resolveServicePackToOrder,
  },
};
