import angular from 'angular';

import ducBandwidth from './bandwidth';
import ducBytes from './bytes';

const moduleName = 'dedicatedUniverseComponents';

angular
  .module(moduleName, [
    ducBandwidth,
    ducBytes,
  ]);

export default moduleName;
