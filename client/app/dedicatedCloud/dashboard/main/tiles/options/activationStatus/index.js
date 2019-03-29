import {
  ACTIVATION_STATUS,
} from './constants';

import component from './component';

const componentName = 'activationStatus';
const constantName = 'ACTIVATION_STATUS';
const moduleName = 'activationStatus';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
  ])
  .component(componentName, component)
  .constant(constantName, ACTIVATION_STATUS)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
