// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';
// import '@uirouter/angularjs';

import {
  MODULE_NAME,
  SERVICE_NAME,
} from './constants';
import service from './service';
import servicePackOptionModuleName from './option';

angular
  .module(MODULE_NAME, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
    servicePackOptionModuleName,
  ])
  .service(SERVICE_NAME, service);

export default MODULE_NAME;
