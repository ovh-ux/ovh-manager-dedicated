// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';
// import '@uirouter/angularjs';

import * as selection from './selection';
import * as confirmation from './confirmation';
import * as summary from './summary';

import component from './component';
import service from './service';
import state from './state';

const moduleName = 'dedicatedCloudServicePackBasicOptionActivation';

const steps = [
  selection,
  confirmation,
  summary,
];

angular
  .module(moduleName, [
    ...steps.map(step => step.moduleName),
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedCloudServicePackBasicOptionActivation', component)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.servicePackBasicOptionActivation', state);

    steps.forEach((step) => {
      const stepName = _.camelCase(step.moduleName.replace(moduleName, ''));

      $stateProvider.state(
        `app.dedicatedClouds.servicePackBasicOptionActivation.${stepName}`,
        {
          ...step.state,
          ...{
            url: `/${stepName}`,
            views: {
              dedicatedCloudServicePackBasicOptionActivationStep: step.moduleName,
            },
          },
        },
      );
    });
  })
  .service('dedicatedCloudServicePackBasicOptionActivationService', service)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
