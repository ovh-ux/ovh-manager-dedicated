import component from './upgrade.component';

const orderableServicePacks = /* @ngInject */ (
  $transition$,
  currentService,
  currentUser,
  ovhManagerPccServicePackService,
) => $transition$.params().orderableServicePacks
    || ovhManagerPccServicePackService
      .getOrderable({
        activationType: $transition$.params().activationType,
        currentServicePackName: currentService.servicePackName,
        serviceName: currentService.serviceName,
        subsidiary: currentUser.ovhSubsidiary,
      });

const servicePacks = /* @ngInject */ (
  $transition$,
  currentService,
  currentUser,
  ovhManagerPccServicePackService,
) => $transition$.params().servicePacks
    || ovhManagerPccServicePackService
      .getServicePacks(currentService.serviceName, currentUser.ovhSubsidiary);

export const state = {
  name: 'app.dedicatedClouds.servicePack',
  params: {
    orderableServicePacks: null,
    servicePacks: null,
  },
  resolve: {
    orderableServicePacks,
    servicePacks,
  },
  translations: { value: ['.'], format: 'json' },
  url: '/servicePack?activationType&goToConfiguration',
  views: {
    pccView: component.name,
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  state,
  registerState,
};
