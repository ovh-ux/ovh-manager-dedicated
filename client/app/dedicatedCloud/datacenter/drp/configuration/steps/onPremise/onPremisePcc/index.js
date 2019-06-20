import component from './dedicatedCloud-datacenter-drp-onPremise-onPremisePccStep.component';

const componentName = 'dedicdedicatedCloudDatacenterDrpOnPremiseOnPremisePccStep';
const moduleName = 'dedicdedicatedCloudDatacenterDrpOnPremiseOnPremisePccStep';

angular
  .module(moduleName, [])
  .component(componentName, component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.drp.onPremise.onPremisePccStep', {
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
