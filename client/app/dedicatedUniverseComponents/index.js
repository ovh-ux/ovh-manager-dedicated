import angular from 'angular';

import ducBandwidth from './bandwidth';

const moduleName = 'dedicatedUniverseComponents';

angular
  .module(moduleName, [
    ducBandwidth,
  ]);

export default moduleName;
