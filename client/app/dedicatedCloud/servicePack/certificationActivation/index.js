// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';
// import '@uirouter/angularjs';

import component from './component';
import config from './config';
import {
  COMPONENT_NAME,
  MODULE_NAME,
  SERVICE_NAME,
  STEPS,
} from './constants';
import service from './service';

angular
  .module(MODULE_NAME, [
    ...STEPS.map(step => step.moduleName),
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(COMPONENT_NAME, component)
  .config(config)
  .service(SERVICE_NAME, service)
  .run(/* @ngTranslationsInject ./translations */);

export default MODULE_NAME;
