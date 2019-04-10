import {
  controller,
  controllerName,
} from './controller';

import state from './state';

const MODULE_NAME = 'resourceUpgrade';

angular
  .module(MODULE_NAME, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .controller(controllerName, controller)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.datastores.resourceUpgrade', _.clone(state));
    $stateProvider.state('app.dedicatedClouds.datacenter.hosts.resourceUpgrade', _.clone(state));
  })
  .run(/* @ngTranslationsInject ./translations */);

export default MODULE_NAME;