const hasDefaultMeansOfPayment = /* @ngInject */ ovhPaymentMethod => ovhPaymentMethod
  .hasDefaultPaymentMethod();

const header = /* @ngInject */ (
  $transition$,
  $translate,
) => $translate.instant(`dedicatedCloud_servicePackActivation_selection_${$transition$.params().activationType}_header`);

const resolveHostFamilies = /* @ngInject */ (
  currentService,
  dedicatedCloudServicePack,
) => dedicatedCloudServicePack.fetchHostFamilies(currentService.name);

const resolveOrderableServicePacks = /* @ngInject */ (
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
  currentUser,
  dedicatedCloudServicePack,
  hostFamilies,
) => dedicatedCloudServicePack
  .fetchPrices(currentUser.ovhSubsidiary, hostFamilies, $transition$.params().servicePacks);

const subheader = /* @ngInject */ (
  $transition$,
  $translate,
) => $translate.instant(`dedicatedCloud_servicePackActivation_selection_${$transition$.params().activationType}_subheader`);

export default {
  params: {
    orderableServicePacks: null,
  },
  resolve: {
    hasDefaultMeansOfPayment,
    header,
    hostFamilies: resolveHostFamilies,
    orderableServicePacks: resolveOrderableServicePacks,
    servicePacks,
    subheader,
  },
};
