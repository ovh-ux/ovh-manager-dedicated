const header = /* @ngInject */ (
  $transition$,
  $translate,
) => $translate.instant(`dedicatedCloud_servicePackActivation_selection_${$transition$.params().activationType}_header`);

const resolveNumberOfHosts = /* @ngInject */ (
  currentService,
  dedicatedCloudServicePack,
) => dedicatedCloudServicePack.fetchNumberOfHosts(currentService.name);

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

const prices = /* @ngInject */ (
  currentUser,
  dedicatedCloudServicePack,
  numberOfHosts,
  orderableServicePacks,
) => dedicatedCloudServicePack
  .fetchPrices(currentUser.ovhSubsidiary, numberOfHosts, orderableServicePacks);

const subheader = /* @ngInject */ (
  $transition$,
  $translate,
) => $translate.instant(`dedicatedCloud_servicePackActivation_selection_${$transition$.params().activationType}_subheader`);

export default {
  params: {
    orderableServicePacks: null,
  },
  resolve: {
    header,
    numberOfHosts: resolveNumberOfHosts,
    orderableServicePacks: resolveOrderableServicePacks,
    prices,
    subheader,
  },
};
