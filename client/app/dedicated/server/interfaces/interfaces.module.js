// import angular from 'angular';
import olaActivation from './ola-activation/ola-activation.module';
import olaConfiguration from './ola-configuration/ola-configuration.module';

import component from './interfaces.component';
import routing from './interfaces.routing';
import service from './interfaces.service';

import stepCheckerComponent from './ola-step-checker/ola-step-checker.component';

const moduleName = 'ovhManagerDedicatedServerInterfaces';

angular
  .module(moduleName, [
    olaActivation,
    olaConfiguration,
    'ovh-api-services',
    'ui.router',
  ])
  .component('dedicatedServerInterfaces', component)
  .component('olaStepChecker', stepCheckerComponent)
  .service('DedicatedServerInterfacesService', service)
  .config(routing);

export default moduleName;
