import angular from 'angular';
import translate from 'angular-translate';
import translateAsyncLoader from '@ovh-ux/translate-async-loader';

import ducBytesFilter from './bytes.filter';

const moduleName = 'ducBytes';

angular
  .module(moduleName, [
    translate,
    translateAsyncLoader,
  ])
  .filter('ducBytes', ducBytesFilter)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
