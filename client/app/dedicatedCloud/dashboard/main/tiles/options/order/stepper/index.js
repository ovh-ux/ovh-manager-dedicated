import {
  COMPONENT_NAME,
  MODULE_NAME,
} from './constant';

import component from './component';
import header from './header';

angular
  .module(MODULE_NAME, [
    header,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(COMPONENT_NAME, component);

export default MODULE_NAME;
