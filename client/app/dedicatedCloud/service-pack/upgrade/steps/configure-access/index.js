import component from './configure-access.component';
import {
  name as serviceName,
  ConfigureAccessService,
} from './configure-access.service';

const moduleName = 'ovhManagerPccServicePackUpgradeConfigureAccess';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, ConfigureAccessService);

export default moduleName;
