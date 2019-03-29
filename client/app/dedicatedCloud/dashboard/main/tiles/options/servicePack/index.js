import service from './service';
import option from './option';

const moduleName = 'dedicatedCloudDashboardTilesOptionsServicePack';
const serviceName = 'servicePackService';

angular
  .module(moduleName, [
    option,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .run(/* @ngTranslationsInject ./translations */)
  .service(serviceName, service);

export default moduleName;
