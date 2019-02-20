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
  resolve: {
    orderableServicePacks: resolveOrderableServicePacks,
  },
};
