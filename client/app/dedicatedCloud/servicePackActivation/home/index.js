// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';
// import '@uirouter/angularjs';

import component from './component';
import {
  ACTIVATION_TYPES,
  COMPONENT_NAME,
  CONSTANT_NAME,
  MODULE_NAME,
  STATE_NAME,
} from './constants';
import state from './state';

angular
  .module(MODULE_NAME, [
    ...ACTIVATION_TYPES.all.map(step => step.moduleName),
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(COMPONENT_NAME, component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state(STATE_NAME, state);
  })
  .constant(CONSTANT_NAME, { ACTIVATION_TYPES })
  .run(/* @ngTranslationsInject ./translations */);

export default MODULE_NAME;
