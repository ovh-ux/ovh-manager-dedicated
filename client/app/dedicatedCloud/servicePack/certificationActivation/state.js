/* const resolveOrderableServicePacks = /* @ngInject *//* (
  $transition$,
  currentService,
  currentUser,
  dedicatedCloudServicePackCertificationActivationService,
) => $transition$.params().orderableServicePacks
    || dedicatedCloudServicePackCertificationActivationService
      .fetchOrderable({
        currentServicePackName: currentService.servicePackName,
        serviceName: currentService.serviceName,
        subsidiary: currentUser.ovhSubsidiary,
      }); */

export default {
  url: '/certificationActivation',
  views: {
    pccView: 'dedicatedCloudCertificationActivation',
  },
};
