import {
  CONTROLLER_NAME,
  DATASTORE_STATE_NAME,
  HOST_STATE_NAME,
  MODULE_NAME,
} from './constant';

import controller from './controller';
import state from './state';

angular
  .module(MODULE_NAME, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .controller(CONTROLLER_NAME, controller)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state(DATASTORE_STATE_NAME, _.clone(state));
    $stateProvider.state(HOST_STATE_NAME, _.clone(state));
  })
  .run(/* @ngTranslationsInject ./translations */);

export default MODULE_NAME;
