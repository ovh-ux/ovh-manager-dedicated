import angular from 'angular';
import 'ovh-angular-http';

import DucUserContractService from './user-contract.service';

const moduleName = 'ducContract';

angular
  .module(moduleName, [
    'ovh-angular-http',
  ])
  .service('DucUserContractService', DucUserContractService);

export default moduleName;
