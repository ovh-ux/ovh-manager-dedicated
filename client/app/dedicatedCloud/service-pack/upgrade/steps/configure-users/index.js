import component from './configure-users.component';
import {
  name as serviceName,
  ConfigureUsersService,
} from './configure-users.service';

const moduleName = 'ovhManagerPccServicePackUpgradeConfigureUsers';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, ConfigureUsersService);

export default moduleName;
