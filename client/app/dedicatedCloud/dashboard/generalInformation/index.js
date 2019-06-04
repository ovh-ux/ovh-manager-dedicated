import component from './generalInformation.component';

const moduleName = 'ovhManagerPccDashboardGeneralInformation';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;