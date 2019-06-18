import component from './dedicatedCloud-datacenter-drp-onPremises.component';

import onPremisesPccStep from './onPremisesPcc';
import ovhPccStep from './ovhPcc';

const componentName = 'dedicatedCloudDatacenterDrpOnPremises';
const moduleName = 'dedicatedCloudDatacenterDrpOnPremises';

angular
  .module(moduleName, [
    onPremisesPccStep,
    ovhPccStep,
  ])
  .component(componentName, component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.drp.onPremises', {
      abstract: true,
      views: {
        'progressTrackerView@app.dedicatedClouds.datacenter.drp': {
          component: componentName,
        },
      },
      redirectTo: 'app.dedicatedClouds.datacenter.drp.onPremises.ovhPccStep',
    });
  });

export default moduleName;
