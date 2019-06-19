import component from './activation-status.component';

const moduleName = 'ovhManagerPccDashboardComponentActivationStatus';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
