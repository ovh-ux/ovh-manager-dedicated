import {
  COMPONENT_NAME,
  STATE_NAME,
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

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    STATE_NAME,
    {
      params: {
        orderableServicePacks: null,
      },
      resolve: {
        orderableServicePacks: resolveOrderableServicePacks,
      },
      url: '/certificationActivation',
      views: {
        pccView: COMPONENT_NAME,
      },
    },
  );
};
