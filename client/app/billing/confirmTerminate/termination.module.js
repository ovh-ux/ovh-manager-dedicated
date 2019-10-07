import routing from './termination.routing';
import component from './billing-confirmTerminate.component';

import billingTerminateService from './billing-confirmTerminate.service';
import billingTerminateLegacyService from './billing-confirmTerminateLegacy.service';

const moduleName = 'ovhManagerBillingTermination';

angular.module(moduleName, [
  'ui.router',
])
  .component('billingConfirmTerminate', component)
  .service('BillingTerminate', billingTerminateService)
  .service('BillingTerminateLegacy', billingTerminateLegacyService)
  .config(routing);

export default moduleName;
