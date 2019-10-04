import angular from 'angular';
import translate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import ducPriceDisplay from './price.component';
import ducPriceFilter from './price.filter';
import priceService from './price.service';
import priceDisplayService from './priceDisplay.service';

const moduleName = 'ducPrice';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    translate,
  ])
  .component('ducPriceDisplay', ducPriceDisplay)
  .filter('ducPrice', ducPriceFilter)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('ducPriceService', priceService)
  .service('ducPriceDisplayService', priceDisplayService);

export default moduleName;
