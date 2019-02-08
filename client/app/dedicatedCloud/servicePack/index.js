// import angular from 'angular';
// import 'angular-translate';

import service from './service';

const moduleName = 'dedicatedCloudServicePack';

angular
  .module(moduleName, [
    'pascalprecht.translate',
  ])
  .service('dedicatedCloudServicePackService', service)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
