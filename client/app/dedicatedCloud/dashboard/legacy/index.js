import component from './legacy.component';

import drpAlerts from '../../datacenter/drp/alerts';

const moduleName = 'ovhManagerPccDashboardLegacy';

angular
  .module(moduleName, [
    drpAlerts,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component);

export default moduleName;
