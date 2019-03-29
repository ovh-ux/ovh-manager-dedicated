import component from './component';

const componentName = 'serviceManagementTile';
const moduleName = 'serviceManagementTile';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(componentName, component)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
