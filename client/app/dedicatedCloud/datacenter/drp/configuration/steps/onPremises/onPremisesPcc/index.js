import component from './dedicatedCloud-datacenter-drp-onPremises-onPremisesPccStep.component';

const componentName = 'dedicdedicatedCloudDatacenterDrpOnPremisesOnPremisesPccStep';
const moduleName = 'dedicdedicatedCloudDatacenterDrpOnPremisesOnPremisesPccStep';

angular
  .module(moduleName, [])
  .component(componentName, component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.drp.onPremises.onPremisesPccStep', {
      views: {
        'stepView@app.dedicatedClouds.datacenter.drp': {
          component: componentName,
        },
      },
      params: {
        currentStep: 2,
        drpInformations: { },
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
