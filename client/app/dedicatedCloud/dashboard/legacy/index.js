// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';

import component from './component';
import {
  COMPONENT_NAME,
  MODULE_NAME,
} from './constant';

angular
  .module(MODULE_NAME, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(COMPONENT_NAME, component)
  .run(/* @ngTranslationsInject ./translations */);

export default MODULE_NAME;
