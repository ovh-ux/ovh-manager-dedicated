import agreements from './agreements/user-agreements.module';
import cancelResiliation from './actions/cancel-resiliation/cancel-resiliation.module';
import ssh from './ssh/ssh.module';

import service from './billing-autoRenew.service';

import routing from './autorenew.routing';

const moduleName = 'ovhManagerBillingAutorenew';

angular.module(moduleName, [
  'ui.router',
  agreements,
  cancelResiliation,
  ssh,
])
  .config(routing)
  .service('BillingAutoRenew', service);

export default moduleName;
