import component from './interfaces-attach.component';
import routing from './interface-attach.routing';

const moduleName = 'ovhManagerDedicatedServerInterfacesAttach';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(routing)
  .component('dedicatedServerInterfacesAttach', component);

export default moduleName;
