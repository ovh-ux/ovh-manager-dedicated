import component from './dedicatedCloud-datacenter-drp-summary.component';

import deleteDrp from './delete';

const componentName = 'dedicatedCloudDatacenterDrpSummary';
const moduleName = 'dedicatedCloudDatacenterDrpSummary';

angular
  .module(moduleName, [
    deleteDrp,
  ])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.drp.summary', {
      url: '/summary',
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
