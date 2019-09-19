import component from './private-cancel.component';
import routing from './private-cancel.routing';

const moduleName = 'ovhManagerDedicatedServerBandwidthPrivateCancel';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .component('dedicatedServerBandwidthPublicCancel', component)
  .config(routing);

export default moduleName;
