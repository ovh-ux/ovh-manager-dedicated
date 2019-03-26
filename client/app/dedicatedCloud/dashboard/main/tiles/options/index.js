import {
  CERTIFICATIONS_OPTION_NAME,
  COMPONENT_NAME,
  MODULE_NAME,
  PENDING_ORDER_SERVICE_NAME,
} from './constants';

import activationStatus from './activationStatus';
import component from './component';
import order from './order';
import pendingOrder from './pendingOrderService';
import preference from './preference';
import servicePack from './servicePack';

angular
  .module(MODULE_NAME, [
    activationStatus,
    order,
    'oui',
    'pascalprecht.translate',
    preference,
    servicePack,
    'ui.router',
  ])
  .component(COMPONENT_NAME, component)
  .constant('CERTIFICATIONS_OPTION_NAME', CERTIFICATIONS_OPTION_NAME)
  .run(/* @ngTranslationsInject ./translations */)
  .service(PENDING_ORDER_SERVICE_NAME, pendingOrder);

export default MODULE_NAME;
