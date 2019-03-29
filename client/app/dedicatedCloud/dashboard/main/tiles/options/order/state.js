const orderableServicePacks = /* @ngInject */ (
  $transition$,
  currentService,
  currentUser,
  servicePackService,
) => $transition$.params().orderableServicePacks
    || servicePackService
      .fetchOrderable({
        activationType: $transition$.params().activationType,
        currentServicePackName: currentService.servicePackName,
        serviceName: currentService.serviceName,
        subsidiary: currentUser.ovhSubsidiary,
      });

const servicePacks = /* @ngInject */ (
  $transition$,
  currentService,
  currentUser,
  servicePackService,
) => $transition$.params().servicePacks
    || servicePackService
      .buildAllForService(currentService.serviceName, currentUser.ovhSubsidiary);

const componentName = 'dedicatedCloudServicePack';

export default {
  params: {
    orderableServicePacks: null,
    servicePacks: null,
  },
  resolve: {
    orderableServicePacks,
    servicePacks,
  },
  url: '/servicePack?activationType',
  views: {
    pccView: componentName,
  },
};
