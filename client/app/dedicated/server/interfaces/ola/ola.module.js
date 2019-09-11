import component from './ola.component';
import routing from './ola.routing';

const moduleName = 'ovhManagerDedicatedServerInterfacesOla';

angular
  .module(moduleName, [])
  .config(routing)
  .component('dedicatedServerInterfacesOla', component);

export default moduleName;
