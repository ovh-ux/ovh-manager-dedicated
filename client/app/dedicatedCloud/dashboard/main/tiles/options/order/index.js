import {
  ACTIVATION_TYPES,
  COMPONENT_NAME,
  CONSTANT_NAME,
  MODULE_NAME,
  SERVICE_NAME,
  STATE_NAME,
} from './constants';

import component from './component';
import service from './service';
import servicePack from '../servicePack';
import state from './state';
import stepper from './stepper';

angular
  .module(MODULE_NAME, [
    'oui',
    'pascalprecht.translate',
    servicePack,
    stepper,
    'ui.router',
    ...ACTIVATION_TYPES.all.map(step => step.moduleName),
  ])
  .component(COMPONENT_NAME, component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state(STATE_NAME, state);
  })
  .constant(CONSTANT_NAME, { ACTIVATION_TYPES })
  .run(/* @ngTranslationsInject ./translations */)
  .service(SERVICE_NAME, service);

export default MODULE_NAME;
