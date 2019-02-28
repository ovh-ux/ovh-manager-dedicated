// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';

import component from './component';
import {
  COMPONENT_NAME,
  MODULE_NAME,
  SERVICE_NAME,
} from './constants';
import activationStatusModuleName from '../../components/activationStatus';
import service from './service';

angular
  .module(MODULE_NAME, [
    activationStatusModuleName,
    'dedicatedCloudservicePack',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(COMPONENT_NAME, component)
  .run(/* @ngTranslationsInject ./translations */)
  .service(SERVICE_NAME, service);

export default MODULE_NAME;
