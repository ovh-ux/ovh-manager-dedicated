// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';
// import '@uirouter/angularjs';

import component from './component';
import state from './state';

const moduleName = 'dedicatedCloudServicePackBasicOptionActivationSummary';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedCloudServicePackBasicOptionActivationSummary', component)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;

export {
  moduleName,
  state,
};
