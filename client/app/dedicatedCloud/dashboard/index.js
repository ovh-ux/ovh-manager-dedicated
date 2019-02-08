// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';

import component from './component';
import activationStatusModuleName from '../../components/activationStatus';

const moduleName = 'dedicatedCloudDashboard';

angular
  .module(moduleName, [
    activationStatusModuleName,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedCloudDashboard', component)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
