import component from './dedicatedCloud-datacenter-drp-ovh.component';

import mainPccStep from './mainPcc';
import secondPccStep from './secondPcc';

const componentName = 'dedicatedCloudDatacenterDrpOvh';
const moduleName = 'dedicatedCloudDatacenterDrpOvh';

angular
  .module(moduleName, [
    mainPccStep,
    secondPccStep,
  ])
  .component(componentName, component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.drp.ovh', {
      abstract: true,
      views: {
        'progressTrackerView@app.dedicatedClouds.datacenter.drp': {
          component: componentName,
        },
      },
      redirectTo: 'app.dedicatedClouds.datacenter.drp.ovh.mainPccStep',
    });
  });

export default moduleName;
