// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';

import component from './component';

const moduleName = 'dedicatedCloudCertificationActivation';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedCloudCertificationActivation', component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicatedClouds.certificationActivation',
      {
        url: '/certificationActivation',
        views: {
          pccView: 'dedicatedCloudCertificationActivation',
        },
        resolve: {
          catalog: /* @ngInject */ dedicatedCloudOrder => dedicatedCloudOrder.retrievingCatalog(),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
