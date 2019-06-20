import component from './dedicatedCloud-datacenter-drp-onPremise.component';

import onPremisePccStep from './onPremisePcc';
import ovhPccStep from './ovhPcc';

const componentName = 'dedicatedCloudDatacenterDrpOnPremise';
const moduleName = 'dedicatedCloudDatacenterDrpOnPremise';

angular
  .module(moduleName, [
    onPremisePccStep,
    ovhPccStep,
  ])
  .component(componentName, component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.drp.onPremise', {
      abstract: true,
      views: {
        'progressTrackerView@app.dedicatedClouds.datacenter.drp': {
          component: componentName,
        },
      },
      redirectTo: 'app.dedicatedClouds.datacenter.drp.onPremise.ovhPccStep',
    });
  });

export default moduleName;
