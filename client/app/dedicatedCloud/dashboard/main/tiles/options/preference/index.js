import service from './service';

const moduleName = 'dedicatedCloudDashboardTilesOptionsPreference';
const serviceName = 'preferenceService';

angular
  .module(moduleName, [])
  .service(serviceName, service);

export default moduleName;
