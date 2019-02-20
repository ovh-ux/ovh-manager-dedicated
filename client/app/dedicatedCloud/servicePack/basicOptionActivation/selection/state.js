const resolveCurrentService = /* @ngInject */ (
  $transition$,
  DedicatedCloud,
) => $transition$.params().currentService
    || DedicatedCloud.getSelected($transition$.params().productId, true);

const resolveCurrentUser = /* @ngInject */ (
  $transition$,
  User,
) => $transition$.params().currentUser
      || User.getUser();

const resolveOrderableServicePacks = /* @ngInject */ (
  $transition$,
  currentService,
  currentUser,
  dedicatedCloudServicePackBasicOptionActivationService,
) => $transition$.params().orderableServicePacks
    || dedicatedCloudServicePackBasicOptionActivationService
      .fetchOrderable({
        currentServicePackName: currentService.servicePackName,
        serviceName: currentService.serviceName,
        subsidiary: currentUser.ovhSubsidiary,
      });

export default {
  params: {
    currentService: null,
    currentUser: null,
    orderableServicePacks: null,
  },
  resolve: {
    currentService: resolveCurrentService,
    currentUser: resolveCurrentUser,
    orderableServicePacks: resolveOrderableServicePacks,
  },
};
