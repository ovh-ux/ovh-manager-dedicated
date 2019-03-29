import component from './component';

const componentName = 'legacyDashboard';
const moduleName = 'legacyDashboard';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
  ])
  .component(componentName, component);

export default moduleName;
