// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';
// import '@uirouter/angularjs';

import component from './dedicatedCloud-servicePack-basicOptionActivation.component';
import service from './dedicatedCloud-servicePack-basicOptionActivation.service';
import state from './dedicatedCloud-servicePack-basicOptionActivation.state';

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
