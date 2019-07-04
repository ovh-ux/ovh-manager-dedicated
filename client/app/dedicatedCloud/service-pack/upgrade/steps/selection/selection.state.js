import component from './selection.component';

const resolveActivationType = /* @ngInject */ $transition$ => $transition$.params().activationType;

const resolveCurrentService = /* @ngInject */ (
  $transition$,
  DedicatedCloud,
) => DedicatedCloud.getSelected($transition$.params().productId, true);

const resolveHasDefaultMeansOfPayment = /* @ngInject */ (
  $transition$,
  ovhPaymentMethod,
) => $transition$.params().hasDefaultMeansOfPayment
    || ovhPaymentMethod.hasDefaultPaymentMethod();

const resolveHeader = /* @ngInject */ (
  $transition$,
  $translate,
) => $translate.instant(`dedicatedCloudDashboardTilesOptionsOrderSelection_${$transition$.params().activationType}_header`);

const resolveHostFamilies = /* @ngInject */ (
  currentService,
  ovhManagerPccServicePackService,
) => ovhManagerPccServicePackService.getHostFamilies(currentService.name);

const resolveServicePacks = /* @ngInject */ (
  $transition$,
  currentService,
  currentUser,
  ovhManagerPccServicePackService,
) => $transition$.params().servicePacks
    || ovhManagerPccServicePackService
      .getServicePacks(currentService.serviceName, currentUser.ovhSubsidiary);

const resolveServicePacksWithPrices = /* @ngInject */ (
  currentUser,
  ovhManagerPccServicePackService,
  hostFamilies,
  servicePacks,
) => ovhManagerPccServicePackService
  .getPrices(currentUser.ovhSubsidiary, hostFamilies, servicePacks);

const resolveServicePackToOrder = /* @ngInject */ $transition$ => $transition$
  .params().servicePackToOrder;

const resolveSubHeader = /* @ngInject */ (
  $transition$,
  $translate,
) => $translate.instant(`dedicatedCloudDashboardTilesOptionsOrderSelection_${$transition$.params().activationType}_subheader`);

export default {
  component: component.name,
  params: {
    hasDefaultMeansOfPayment: null,
    orderableServicePacks: null,
    servicePackToOrder: null,
  },
  resolve: {
    activationType: resolveActivationType,
    currentService: resolveCurrentService,
    hasDefaultMeansOfPayment: resolveHasDefaultMeansOfPayment,
    header: resolveHeader,
    hostFamilies: resolveHostFamilies,
    servicePacks: resolveServicePacks,
    servicePacksWithPrices: resolveServicePacksWithPrices,
    servicePackToOrder: resolveServicePackToOrder,
    resolveServicePacksWithPrices,
    subHeader: resolveSubHeader,
  },
  translations: { value: ['.'], format: 'json' },
};
