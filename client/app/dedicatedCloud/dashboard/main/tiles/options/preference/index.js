import {
  MODULE_NAME,
  SERVICE_NAME,
} from './constants';

import service from './service';

angular
  .module(MODULE_NAME, [])
  .service(SERVICE_NAME, service);

export default MODULE_NAME;
