import './style.less';

import {
  COMPONENT_NAME,
  MODULE_NAME,
  SERVICE_NAME,
} from './constants';

import component from './component';
import service from './service';
import step from './step';

angular
  .module(MODULE_NAME, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(COMPONENT_NAME, component)
  .run(/* @ngTranslationsInject ./translations */)
  .service(SERVICE_NAME, service);

export default MODULE_NAME;

export {
  MODULE_NAME,
  step,
};
