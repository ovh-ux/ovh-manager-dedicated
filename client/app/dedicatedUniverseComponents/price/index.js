import angular from 'angular';
import translate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import component from './price.component';
import service from './price.service';

const moduleName = 'ducPrice';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    translate,
  ])
  .component('ducPrice', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('ducPriceService', service);

export default moduleName;
