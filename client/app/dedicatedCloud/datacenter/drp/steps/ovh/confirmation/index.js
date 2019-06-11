import component from './dedicatedCloud-datacenter-drp-ovh-confirmationStep.component';

const componentName = 'dedicatedCloudDatacenterDrpOvhConfirmationStep';
const moduleName = 'dedicatedCloudDatacenterDrpOvhConfirmationStep';

angular
  .module(moduleName, [])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.drp.ovh.confirmationStep', {
      views: {
        'stepView@app.dedicatedClouds.datacenter.drp': {
          component: 'dedicatedCloudDatacenterDrpOvhConfirmationStep',
        },
      },
      params: {
        currentStep: 3,
        drpInformations: { },
      },
    });
  })
  .component(componentName, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
