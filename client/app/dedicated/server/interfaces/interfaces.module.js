// import angular from 'angular';
import ola from './ola/ola.module';

import component from './interfaces.component';
import routing from './interfaces.routing';
import service from './interfaces.service';

import stepCheckerComponent from './ola-step-checker/ola-step-checker.component';

const moduleName = 'ovhManagerDedicatedServerInterfaces';

angular
  .module(moduleName, [
    ola,
    'ovh-api-services',
  ])
  .component('dedicatedServerInterfaces', component)
  .component('olaStepChecker', stepCheckerComponent)
  .service('DedicatedServerInterfacesService', service)
  .config(routing);

export default moduleName;
