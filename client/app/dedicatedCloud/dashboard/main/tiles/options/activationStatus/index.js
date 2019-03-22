import {
  COMPONENT_NAME,
  CONSTANT_NAME,
  MODULE_NAME,
  ACTIVATION_STATUS,
} from './constants';

import component from './component';

angular
  .module(MODULE_NAME, [
    'oui',
    'pascalprecht.translate',
  ])
  .component(COMPONENT_NAME, component)
  .constant(CONSTANT_NAME, ACTIVATION_STATUS)
  .run(/* @ngTranslationsInject ./translations */);

export default MODULE_NAME;
