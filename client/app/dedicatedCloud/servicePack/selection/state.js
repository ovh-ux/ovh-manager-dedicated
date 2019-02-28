const activationType = /* @ngInject */ $transition$ => $transition$.params().servicePacks;

const resolveCurrentService = /* @ngInject */ (
  $transition$,
  DedicatedCloud,
) => DedicatedCloud.getSelected($transition$.params().productId, true);

const hasDefaultMeansOfPayment = /* @ngInject */ ovhPaymentMethod => ovhPaymentMethod
  .hasDefaultPaymentMethod();

const header = /* @ngInject */ (
  $transition$,
  $translate,
) => $translate.instant(`dedicatedCloud_servicePack_selection_${$transition$.params().activationType}_header`);

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

const resolveServicePacks = /* @ngInject */ (
  $transition$,
  currentService,
  currentUser,
  dedicatedCloudServicePack,
) => $transition$.params().servicePacks
    || dedicatedCloudServicePack
      .buildAllForService(currentService.serviceName, currentUser.ovhSubsidiary);

const servicePacksWithPrices = /* @ngInject */ (
  currentUser,
  dedicatedCloudServicePack,
  hostFamilies,
  servicePacks,
) => dedicatedCloudServicePack
  .fetchPrices(currentUser.ovhSubsidiary, hostFamilies, servicePacks);

const subheader = /* @ngInject */ (
  $transition$,
  $translate,
) => $translate.instant(`dedicatedCloud_servicePack_selection_${$transition$.params().activationType}_subheader`);

export default {
  params: {
    orderableServicePacks: null,
  },
  resolve: {
    activationType,
    currentService: resolveCurrentService,
    hasDefaultMeansOfPayment,
    header,
    hostFamilies: resolveHostFamilies,
    orderableServicePacks: resolveOrderableServicePacks,
    servicePacks: resolveServicePacks,
    servicePacksWithPrices,
    subheader,
  },
};
