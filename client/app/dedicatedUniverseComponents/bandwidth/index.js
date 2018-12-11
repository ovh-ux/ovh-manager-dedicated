import angular from 'angular';
import translate from 'angular-translate';
import translateAsyncLoader from '@ovh-ux/translate-async-loader';

import ducBandwidthFilter from './bandwidth.filter';

const moduleName = 'ducBandwidth';

angular
  .module(moduleName, [
    translate,
    translateAsyncLoader,
  ])
  .filter('ducBandwidth', ducBandwidthFilter)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
