import component from './validation.component';
import {
  name as serviceName,
  ValidationService,
} from './validation.service';

const moduleName = 'ovhManagerPccServicePackUpgradeValidation';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, ValidationService);

export default moduleName;
