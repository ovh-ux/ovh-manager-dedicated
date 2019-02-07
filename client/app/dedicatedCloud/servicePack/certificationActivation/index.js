// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';
// import '@uirouter/angularjs';

import * as selection from './selection/index';
import * as requiredConfiguration from './requiredConfiguration/index';
import * as smsActivation from './smsActivation/index';

import component from './component';
import service from './service';
import state from './state';

const moduleName = 'dedicatedCloudServicePackCertificationActivation';

const steps = [
  selection,
  requiredConfiguration,
  smsActivation,
];

angular
  .module(moduleName, [
    ...steps.map(step => step.moduleName),
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.servicePackCertificationActivation', state);

    steps.forEach((step) => {
      const stepName = _.camelCase(step.moduleName.replace(moduleName, ''));

      $stateProvider.state(
        `app.dedicatedClouds.servicePackCertificationActivation.${stepName}`,
        {
          ...step.state,
          ...{
            url: `/${stepName}`,
            views: {
              dedicatedCloudServicePackCertificationActivationStep: step.moduleName,
            },
          },
        },
      );
    });
  })
  .service('dedicatedCloudServicePackCertificationActivationService', service)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
