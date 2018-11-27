import angular from 'angular';

import ducBandwidth from './bandwidth';
import ducBytes from './bytes';
import ducContract from './contract';
import ducPrice from './price';
import ducTranslate from './translate';

const moduleName = 'dedicatedUniverseComponents';

angular
  .module(moduleName, [
    ducBandwidth,
    ducBytes,
    ducContract,
    ducPrice,
    ducTranslate,
  ]);

export default moduleName;
