import {
  CERTIFICATIONS_OPTION_NAME,
} from './constants';

import activationStatus from './activationStatus';
import component from './component';
import order from './order';
import pendingOrder from './pendingOrderService';
import preference from './preference';
import servicePack from './servicePack';

const componentName = 'optionTile';
const constantName = 'CERTIFICATIONS_OPTION_NAME';
const moduleName = 'dedicatedCloudDashboardTilesOptions';
const serviceName = 'pendingOrderService';

angular
  .module(moduleName, [
    activationStatus,
    order,
    'oui',
    'pascalprecht.translate',
    preference,
    servicePack,
    'ui.router',
  ])
  .component(componentName, component)
  .constant(constantName, CERTIFICATIONS_OPTION_NAME)
  .run(/* @ngTranslationsInject ./translations */)
  .service(serviceName, pendingOrder);

export default moduleName;
