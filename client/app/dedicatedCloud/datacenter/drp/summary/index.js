import component from './dedicatedCloud-datacenter-drp-summary.component';

const componentName = 'dedicatedCloudDatacenterDrpSummary';
const moduleName = 'dedicatedCloudDatacenterDrpSummary';

angular
  .module(moduleName, [])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.drp.summary', {
      views: {
        'summaryView@app.dedicatedClouds.datacenter.drp': {
          component: 'dedicatedCloudDatacenterDrpSummary',
        },
      },
      params: {
        drpInformations: { },
      },
    });
  })
  .component(componentName, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
