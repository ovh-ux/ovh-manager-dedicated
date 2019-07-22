import component from './form.component';

const moduleName = 'ovhManagerBillingAutorenewUpdateForm';

angular.module(moduleName, [
])
  .component('billingAutorenewUpdateForm', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
