import component from './component';
import generalInformationTile from './tiles/generalInformation';
import optionTile from './tiles/options';
import serviceManagementTile from './tiles/serviceManagement';

const componentName = 'dashboard';
const moduleName = 'dashboard';

angular
  .module(moduleName, [
    generalInformationTile,
    optionTile,
    'oui',
    'pascalprecht.translate',
    serviceManagementTile,
    'ui.router',
  ])
  .component(componentName, component)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
