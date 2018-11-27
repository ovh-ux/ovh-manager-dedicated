import angular from 'angular';

import ducBandwidth from './bandwidth';
import ducBytes from './bytes';
import ducContract from './contract';

const moduleName = 'dedicatedUniverseComponents';

angular
  .module(moduleName, [
    ducBandwidth,
    ducBytes,
    ducContract,
  ]);

export default moduleName;
