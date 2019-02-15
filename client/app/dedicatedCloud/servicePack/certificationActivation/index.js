// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';
// import '@uirouter/angularjs';

import component from './component';
import {
  COMPONENT_NAME,
  MODULE_NAME,
  STATE_NAME,
  STEPS,
} from './constants';
import service from './service';

angular
  .module(MODULE_NAME, [
    ...STEPS.map(step => step.moduleName),
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(COMPONENT_NAME, component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      STATE_NAME,
      {
        url: '/certificationActivation',
        views: {
          pccView: COMPONENT_NAME,
        },
      },
    );
  })
  .service('dedicatedCloudServicePackCertificationActivationService', service)
  .run(/* @ngTranslationsInject ./translations */);

export default MODULE_NAME;
