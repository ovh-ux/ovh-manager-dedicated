import {
  COMPONENT_NAME,
} from './constants';

const resolveOrderableServicePacks = /* @ngInject */ (
  $transition$,
  currentService,
  currentUser,
  dedicatedCloudCertificationActivationService,
) => $transition$.params().orderableServicePacks
    || dedicatedCloudCertificationActivationService
      .fetchOrderable({
        currentServicePackName: currentService.servicePackName,
        serviceName: currentService.serviceName,
        subsidiary: currentUser.ovhSubsidiary,
      });

export default {
  params: {
    orderableServicePacks: null,
  },
  resolve: {
    orderableServicePacks: resolveOrderableServicePacks,
  },
  url: '/servicePackActivation?activationType',
  views: {
    pccView: COMPONENT_NAME,
  },
};
