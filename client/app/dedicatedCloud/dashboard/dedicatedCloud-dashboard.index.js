// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';

import component from './dedicatedCloud-dashboard.component';

const moduleName = 'dedicatedCloudDashboard';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedCloudDashboard', component)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
