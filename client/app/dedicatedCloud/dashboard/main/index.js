// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';

import component from './component';
import {
  COMPONENT_NAME,
  MODULE_NAME,
} from './constants';

angular
  .module(MODULE_NAME, [
    'optionTile',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(COMPONENT_NAME, component)
  .run(/* @ngTranslationsInject ./translations */);

export default MODULE_NAME;
