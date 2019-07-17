import routing from './ssh.routing';

const moduleName = 'ovhManagerBillingSshKeys';

angular.module(moduleName, [
  'ui.router',
])
  .config(routing);

export default moduleName;
