import component from '../../common/mainPcc/dedicatedCloud-datacenter-drp-mainPccStep.component';

const componentName = 'dedicatedCloudDatacenterDrpOnPremiseOvhPccStep';
const moduleName = 'dedicatedCloudDatacenterDrpOnPremiseOvhPccStep';

angular
  .module(moduleName, [])
  .component(componentName, component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('app.dedicatedClouds.datacenter.drp.onPremise.ovhPccStep', {
        views: {
          'stepView@app.dedicatedClouds.datacenter.drp': {
            component: componentName,
          },
        },
        params: {
          currentStep: 1,
          drpInformations: { },
        },
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
