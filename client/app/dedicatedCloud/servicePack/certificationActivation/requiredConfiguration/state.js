const resolveAllowedIPsAndBlocks = /* @ngInject */ (
  $transition$,
  DedicatedCloud,
) => $transition$.params().allowedIPsAndBlocks
  || DedicatedCloud
    .getSecurityPolicies($transition$.params().productId, null, null, true)
    .then(allowedIPsAndBlocks => allowedIPsAndBlocks.list.results);

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

export default {
  params: {
    currentService: null,
    allowedIPsAndBlocks: null,
    hasDefaultMeansOfPayment: null,
  },
  resolve: {
    currentService: resolveCurrentService,
    allowedIPsAndBlocks: resolveAllowedIPsAndBlocks,
    hasDefaultMeansOfPayment: resolveHasDefaultMeansOfPayment,
  },
};
