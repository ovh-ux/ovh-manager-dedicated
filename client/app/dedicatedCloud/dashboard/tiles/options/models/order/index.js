import {
  name as serviceName,
  OptionsService,
} from './order.service';

const moduleName = 'ovhManagerPccDashboardOptionsOrder';

angular
  .module(moduleName, [])
  .service(serviceName, OptionsService);

export default moduleName;
