import angular from 'angular';

import ducBytes from './bytes';

const moduleName = 'dedicatedUniverseComponents';

angular
  .module(moduleName, [
    ducBytes,
  ]);

export default moduleName;
