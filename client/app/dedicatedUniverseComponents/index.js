import angular from 'angular';

import ducPrice from './price';

const moduleName = 'dedicatedUniverseComponents';

angular
  .module(moduleName, [
    ducPrice,
  ]);

export default moduleName;
