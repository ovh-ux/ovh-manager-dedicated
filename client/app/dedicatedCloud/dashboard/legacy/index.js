import component from './component';
import {
  COMPONENT_NAME,
  MODULE_NAME,
} from './constant';

angular
  .module(MODULE_NAME, [
    'oui',
    'pascalprecht.translate',
  ])
  .component(COMPONENT_NAME, component);

export default MODULE_NAME;
