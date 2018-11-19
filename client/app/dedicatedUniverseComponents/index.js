import angular from 'angular';

import ducTranslate from './translate';

const moduleName = 'dedicatedUniverseComponents';

angular
  .module(moduleName, [
    ducTranslate,
  ]);

export default moduleName;
