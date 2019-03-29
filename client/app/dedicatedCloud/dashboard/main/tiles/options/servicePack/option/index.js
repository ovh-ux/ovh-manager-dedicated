// import angular from 'angular';
// import 'angular-translate';

import {
  OPTIONS,
  OPTION_TYPES,
} from './constants';
import service from './service';

const constantName = 'DEDICATED_CLOUD_SERVICE_PACK_OPTION';
const moduleName = 'dedicatedCloudServicePackOption';
const serviceName = 'servicePackOptionService';

angular
  .module(moduleName, [
    'pascalprecht.translate',
  ])
  .constant(constantName, { OPTIONS, OPTION_TYPES })
  .run(/* @ngTranslationsInject ./translations */)
  .service(serviceName, service);

export default moduleName;
