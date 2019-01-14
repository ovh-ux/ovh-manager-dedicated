import angular from 'angular';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';

import DucUserContractService from './user-contract.service';

const moduleName = 'ducContract';

angular
  .module(moduleName, [
    ngOvhHttp,
  ])
  .service('DucUserContractService', DucUserContractService);

export default moduleName;
