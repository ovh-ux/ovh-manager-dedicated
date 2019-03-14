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
  .run(/* @ngTranslationsInject ./translations */)
  .service(SERVICE_NAME, service);

export default MODULE_NAME;
