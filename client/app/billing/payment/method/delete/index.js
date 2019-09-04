import angular from 'angular';

import 'angular-translate';
import 'ovh-ui-angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ng-ui-router-layout';

import routing from './routing';
import component from './component';

const moduleName = 'ovhBillingPaymentMethodDelete';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhPaymentMethod',
    'ngUiRouterLayout',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
