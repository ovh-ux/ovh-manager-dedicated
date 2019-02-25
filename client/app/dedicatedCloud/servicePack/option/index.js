// import angular from 'angular';
// import 'angular-translate';

import {
  CONSTANT_NAME,
  MODULE_NAME,
  OPTIONS,
  OPTION_TYPES,
  SERVICE_NAME,
} from './constants';
import service from './service';

angular
  .module(MODULE_NAME, [
    'pascalprecht.translate',
  ])
  .constant(CONSTANT_NAME, { OPTIONS, OPTION_TYPES })
  .service(SERVICE_NAME, service)
  .run(/* @ngTranslationsInject ./translations */);

export default MODULE_NAME;
