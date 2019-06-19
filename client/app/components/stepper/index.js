import header from './header';

import component from './stepper.component';

const moduleName = 'ovhManagerComponentStepper';

angular
  .module(moduleName, [
    header,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component);

export default moduleName;
