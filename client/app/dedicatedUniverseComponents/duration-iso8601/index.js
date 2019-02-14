import angular from 'angular';
import translate from 'angular-translate';
import translateAsyncLoader from '@ovh-ux/translate-async-loader';
import durationISO8601Filter from './duration-iso8601.filter';

const moduleName = 'durationISO8601';

angular
  .module(moduleName, [
    translateAsyncLoader,
    translate,
  ])
  .filter('durationISO8601', durationISO8601Filter)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
