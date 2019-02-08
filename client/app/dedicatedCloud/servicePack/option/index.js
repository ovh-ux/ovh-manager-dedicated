// import angular from 'angular';
// import 'angular-translate';

import service from './service';

const moduleName = 'dedicatedCloudServicePackOption';

angular
  .module(moduleName, [
    'pascalprecht.translate',
  ])
  .service('dedicatedCloudServicePackOptionService', service)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
