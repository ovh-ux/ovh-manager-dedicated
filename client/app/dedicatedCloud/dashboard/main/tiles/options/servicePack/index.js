import {
  MODULE_NAME,
  SERVICE_NAME,
} from './constants';

import service from './service';
import option from './option';

angular
  .module(MODULE_NAME, [
    option,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .run(/* @ngTranslationsInject ./translations */)
  .service(SERVICE_NAME, service);

export default MODULE_NAME;
