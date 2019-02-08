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
  url: '/servicePackBasicOptionActivation',
  views: {
    pccView: 'dedicatedCloudServicePackBasicOptionActivation',
  },
  params: {
    orderableServicePacks: null,
  },
  resolve: {
    orderableServicePacks: resolveOrderableServicePacks,
  },
};
