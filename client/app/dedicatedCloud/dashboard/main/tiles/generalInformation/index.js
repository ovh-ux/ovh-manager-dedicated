import component from './component';

const moduleName = 'generalInformationTile';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(moduleName, component)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
