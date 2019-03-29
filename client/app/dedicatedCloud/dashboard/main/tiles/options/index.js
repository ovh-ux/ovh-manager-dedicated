import {
  CERTIFICATIONS_OPTION_NAME,
  UNEXISTING_PREFERENCE_ORDER,
} from './constants';

import activationStatus from './activationStatus';
import component from './component';
import order from './order';
import pendingOrder from './pendingOrderService';
import preference from './preference';
import servicePack from './servicePack';

const componentName = 'optionTile';
const certificationConstantName = 'CERTIFICATIONS_OPTION_NAME';
const moduleName = 'dedicatedCloudDashboardTilesOptions';
const serviceName = 'pendingOrderService';
const unexistingPreferenceOrderConstantName = 'UNEXISTING_PREFERENCE_ORDER';

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
  .constant(certificationConstantName, CERTIFICATIONS_OPTION_NAME)
  .constant(unexistingPreferenceOrderConstantName, UNEXISTING_PREFERENCE_ORDER)
  .run(/* @ngTranslationsInject ./translations */)
  .service(serviceName, pendingOrder);

export default moduleName;
