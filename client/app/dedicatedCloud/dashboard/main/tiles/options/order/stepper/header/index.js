import {
  COMPONENT_NAME,
  MODULE_NAME,
} from './constant';

import component from './component';

angular
  .module(MODULE_NAME, [
    'oui',
    'pascalprecht.translate',
  ])
  .component(COMPONENT_NAME, component)
  .run(/* @ngTranslationsInject ./translations */);

export default MODULE_NAME;
