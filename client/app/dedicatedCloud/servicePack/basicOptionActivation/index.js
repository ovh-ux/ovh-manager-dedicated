// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';
// import '@uirouter/angularjs';

import component from './component';
import service from './service';
import state from './state';

const moduleName = 'dedicatedCloudServicePackBasicOptionActivation';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedCloudServicePackBasicOptionActivation', component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.servicePackBasicOptionActivation', state);
  })
  .service('dedicatedCloudServicePackBasicOptionActivationService', service)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
