import agreements from './agreements/user-agreements.module';

import routing from './autorenew.routing';

const moduleName = 'ovhManagerBillingAutorenew';

angular.module(moduleName, [
  'ui.router',
  agreements,
])
  .config(routing);

export default moduleName;
