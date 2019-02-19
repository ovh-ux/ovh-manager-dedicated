// import angular from 'angular';
// import 'angular-translate';

import {
  MODULE_NAME,
  SERVICE_NAME,
} from './constants';
import service from './service';

angular
  .module(MODULE_NAME, [
    'pascalprecht.translate',
  ])
  .service(SERVICE_NAME, service)
  .run(/* @ngTranslationsInject ./translations */);

export default MODULE_NAME;
