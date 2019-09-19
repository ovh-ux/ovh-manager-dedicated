import component from './public-cancel.component';
import routing from './public-cancel.routing';

const moduleName = 'ovhManagerDedicatedServerBandwidthPublicCancel';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .component('dedicatedServerBandwidthPrivateCancel', component)
  .config(routing);

export default moduleName;
