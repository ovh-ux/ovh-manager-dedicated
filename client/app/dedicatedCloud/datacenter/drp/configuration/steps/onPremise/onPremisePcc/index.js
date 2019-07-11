import component from './dedicatedCloud-datacenter-drp-onPremise-onPremisePccStep.component';

const componentName = 'dedicatedCloudDatacenterDrpOnPremiseOnPremisePccStep';
const moduleName = 'dedicatedCloudDatacenterDrpOnPremiseOnPremisePccStep';

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
