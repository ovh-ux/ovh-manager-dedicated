const resolveCurrentService = /* @ngInject */ (
  $transition$,
  DedicatedCloud,
) => $transition$.params().currentService
    || DedicatedCloud.retrievingFullService($transition$.params().productId);

const resolveHasDefaultMeansOfPayment = /* @ngInject */ (
  $transition$,
  ovhPaymentMethod,
) => $transition$.params().hasDefaultMeansOfPayment
    || ovhPaymentMethod.hasDefaultPaymentMethod();

const resolveNameOfServicePackToOrder = /* @ngInject */ $transition$ => $transition$
  .params().nameOfServicePackToOrder;

export default {
  params: {
    currentService: null,
    hasDefaultMeansOfPayment: null,
    nameOfServicePackToOrder: null,
  },
  resolve: {
    currentService: resolveCurrentService,
    hasDefaultMeansOfPayment: resolveHasDefaultMeansOfPayment,
    nameOfServicePackToOrder: resolveNameOfServicePackToOrder,
  },
};
