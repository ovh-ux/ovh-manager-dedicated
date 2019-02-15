// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';
// import '@uirouter/angularjs';

import component from './component';
import { COMPONENT_NAME, MODULE_NAME } from './constants';

import headerModuleName from './header';

angular
  .module(MODULE_NAME, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
    headerModuleName,
  ])
  .component(COMPONENT_NAME, component);

export default MODULE_NAME;
