import angular from 'angular';

import 'angular-translate';
import 'ovh-ui-angular';
import '@ovh-ux/ng-translate-async-loader';

import component from './component';

const moduleName = 'ovhBillingPaymentMethodAddLegacyBankAccountView';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
