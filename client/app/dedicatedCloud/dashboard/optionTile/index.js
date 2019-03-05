// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';

import component from './component';
import {
  COMPONENT_NAME,
  MODULE_NAME,
  SERVICE_NAME,
} from './constants';
import service from './service';

angular
  .module(MODULE_NAME, [
    'activationStatus',
    'dedicatedCloudServicePack',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(COMPONENT_NAME, component)
  .run(/* @ngTranslationsInject ./translations */)
  .service(SERVICE_NAME, service);

export default MODULE_NAME;
