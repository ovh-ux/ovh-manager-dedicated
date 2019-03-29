import {
  ACTIVATION_TYPES,
} from './constants';

import component from './component';
import service from './service';
import servicePack from '../servicePack';
import state from './state';
import stepper from './stepper';

const componentName = 'dedicatedCloudServicePack';
const constantName = 'DEDICATED_CLOUD_SERVICE_PACK_ACTIVATION';
const moduleName = 'dedicatedCloudDashboardTilesOptionsOrder';
const serviceName = 'orderService';
const stateName = 'app.dedicatedClouds.servicePack';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    servicePack,
    stepper,
    'ui.router',
    ...ACTIVATION_TYPES.all,
  ])
  .component(componentName, component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state(stateName, state);
  })
  .constant(constantName, { ACTIVATION_TYPES })
  .run(/* @ngTranslationsInject ./translations */)
  .service(serviceName, service);

export default moduleName;
