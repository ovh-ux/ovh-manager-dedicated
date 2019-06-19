
import confirm from './components/confirm';
import servicePack from '..';
import stepper from '../../../components/stepper';

import component from './upgrade.component';
import { registerState } from './upgrade.routing';
import {
  name as serviceName,
  UpgradeService,
} from './upgrade.service';

import { ACTIVATION_TYPES } from './upgrade.constants';

const moduleName = 'ovhManagerPccServicePackUpgrade';

angular
  .module(moduleName, [
    confirm,
    'oui',
    'pascalprecht.translate',
    servicePack,
    stepper,
    'ui.router',
    ...ACTIVATION_TYPES.all,
  ])
  .component(component.name, component)
  .config(registerState)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, UpgradeService);

export default moduleName;
