import angular from 'angular';

import ducNotification from './notification';

const moduleName = 'dedicatedUniverseComponents';

angular
  .module(moduleName, [
    ducNotification,
  ]);

export default moduleName;
