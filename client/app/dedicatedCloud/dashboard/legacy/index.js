import {
  component,
  componentName,
} from './component';

const MODULE_NAME = 'legacyDashboard';

angular
  .module(MODULE_NAME, [
    'oui',
    'pascalprecht.translate',
  ])
  .component(componentName, component);

export default MODULE_NAME;
