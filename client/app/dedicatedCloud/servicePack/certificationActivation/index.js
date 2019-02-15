// import angular from 'angular';
// import 'angular-translate';
// import 'ovh-ui-angular';
// import '@uirouter/angularjs';

import component from './component';
import { COMPONENT_NAME, MODULE_NAME, STEPS } from './constants';
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
    const stepperStateName = 'app.dedicatedClouds.certificationActivation';
    $stateProvider.state(
      stepperStateName,
      {
        url: '/certificationActivation',
        views: {
          pccView: COMPONENT_NAME,
        },
      },
    );

    let currentStepName = stepperStateName;
    STEPS.forEach((step) => {
      const suffixForStepName = _.camelCase(step.moduleName.replace(MODULE_NAME, ''));
      currentStepName = `${currentStepName}.${suffixForStepName}`;

      $stateProvider.state(
        currentStepName,
        {
          data: {
            stepperStateName,
          },
          views: {
            [`@${stepperStateName}`]: step.moduleName,
          },
        },
      );
    });
  })
  .service('dedicatedCloudServicePackCertificationActivationService', service)
  .run(/* @ngTranslationsInject ./translations */);

export default MODULE_NAME;
