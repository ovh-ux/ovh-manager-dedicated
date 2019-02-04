// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';
// import '@uirouter/angularjs';

import dedicatedCloudOptionActivation from './component';

const moduleName = 'dedicatedCloudOptionActivation';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedCloudOptionActivation', dedicatedCloudOptionActivation)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicatedClouds.optionActivation',
      {
        url: '/optionActivation',
        views: {
          pccView: moduleName,
        },
        resolve: {
          catalog: /* @ngInject */ dedicatedCloudOrder => dedicatedCloudOrder.retrievingCatalog(),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
