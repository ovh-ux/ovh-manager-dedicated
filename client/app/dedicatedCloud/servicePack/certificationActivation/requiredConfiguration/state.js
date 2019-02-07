const resolveAllowedIPsAndBlocks = /* @ngInject */ (
  $transition$,
  DedicatedCloud,
) => $transition$.params().allowedIPsAndBlocks
  || DedicatedCloud.getSecurityPolicies($transition$.params().productId, null, null, true);

const resolveCurrentService = /* @ngInject */ (
  $transition$,
  DedicatedCloud,
) => $transition$.params().currentService
    || DedicatedCloud.retrievingFullService($transition$.params().productId);

export default {
  params: {
    currentService: null,
    allowedIPsAndBlocks: null,
  },
  resolve: {
    currentService: resolveCurrentService,
    allowedIPsAndBlocks: resolveAllowedIPsAndBlocks,
  },
};
