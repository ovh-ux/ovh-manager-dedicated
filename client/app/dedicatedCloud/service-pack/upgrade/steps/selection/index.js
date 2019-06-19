import './selection.less';

import component from './selection.component';
import {
  name as serviceName,
  SelectionService,
} from './selection.service';

const moduleName = 'ovhManagerPccServicePackUpgradeSelection';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, SelectionService);

export default moduleName;
