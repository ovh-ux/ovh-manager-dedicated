import angular from 'angular';
import translate from 'angular-translate';
import translateAsyncLoader from '@ovh-ux/translate-async-loader';
import '@ovh-ux/ovh-utils-angular';

import ducOvhTabsDirective from './tabs.directive';

const moduleName = 'ducTabs';

angular
  .module(moduleName, [
    'digitalfondue.dftabmenu',
    'ovh-utils-angular',
    translate,
    translateAsyncLoader,
  ])
  .directive('ducOvhTabs', ducOvhTabsDirective)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
