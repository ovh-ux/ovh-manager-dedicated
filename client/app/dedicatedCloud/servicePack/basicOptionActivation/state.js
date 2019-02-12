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
    orderableServicePacks: null,
  },
  redirectTo: 'app.dedicatedClouds.servicePackBasicOptionActivation.selection',
  resolve: {
    orderableServicePacks: resolveOrderableServicePacks,
  },
  url: '/servicePackBasicOptionActivation',
  views: {
    pccView: 'dedicatedCloudServicePackBasicOptionActivation',
  },
};
