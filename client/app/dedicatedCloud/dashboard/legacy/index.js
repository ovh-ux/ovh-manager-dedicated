import component from './legacy.component';

import drpAlerts from '../../datacenter/drp/alerts';
import drpDatacenterSelection from '../../drpDatacenterSelection';

const moduleName = 'ovhManagerPccDashboardLegacy';

angular
  .module(moduleName, [
    drpAlerts,
    drpDatacenterSelection,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component);

export default moduleName;
