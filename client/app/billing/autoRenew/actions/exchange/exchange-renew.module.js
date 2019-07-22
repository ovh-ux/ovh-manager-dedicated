import component from './exchange-renew.component';
import routing from './exchange-renew.routing';

const moduleName = 'ovhManagerBillingAutorenewExchangeRenew';

angular.module(moduleName, [
  'ui.router',
])
  .config(routing)
  .component('billingAutorenewExchangeRenew', component);

export default moduleName;
