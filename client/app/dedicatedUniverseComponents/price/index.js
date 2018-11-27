import angular from 'angular';
import translate from 'angular-translate';
import translateAsyncLoader from '@ovh-ux/translate-async-loader';

import ducPriceFilter from './price.filter';

const moduleName = 'ducPrice';

angular
  .module(moduleName, [
    translate,
    translateAsyncLoader,
  ])
  .filter('ducPrice', ducPriceFilter)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
