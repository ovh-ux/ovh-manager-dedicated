// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';

import component from './component';
import { ALL_TYPES } from './constants';

const moduleName = 'dedicatedCloudActivationStatus';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedCloudActivationStatus', component)
  .constant('DEDICATED_CLOUD_ACTIVATION_STATUS', ALL_TYPES)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
