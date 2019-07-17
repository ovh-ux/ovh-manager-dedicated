import agreements from './agreements/user-agreements.module';
import ssh from './ssh/ssh.module';

import routing from './autorenew.routing';

const moduleName = 'ovhManagerBillingAutorenew';

angular.module(moduleName, [
  'ui.router',
  agreements,
  ssh,
])
  .config(routing);

export default moduleName;
