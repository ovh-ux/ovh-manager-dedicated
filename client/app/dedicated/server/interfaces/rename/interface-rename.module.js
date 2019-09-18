import component from './interfaces-rename.component';
import routing from './interface-rename.routing';

const moduleName = 'ovhManagerDedicatedServerInterfacesRename';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(routing)
  .component('dedicatedServerInterfacesRename', component);

export default moduleName;
