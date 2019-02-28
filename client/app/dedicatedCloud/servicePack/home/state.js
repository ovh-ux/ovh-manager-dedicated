import {
  COMPONENT_NAME,
} from './constants';

const orderableServicePacks = /* @ngInject */ (
  $transition$,
  currentService,
  currentUser,
  dedicatedCloudServicePack,
) => $transition$.params().orderableServicePacks
    || dedicatedCloudServicePack
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
  dedicatedCloudServicePack,
) => $transition$.params().servicePacks
    || dedicatedCloudServicePack
      .buildAllForService(currentService.serviceName, currentUser.ovhSubsidiary);

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
    pccView: COMPONENT_NAME,
  },
};
