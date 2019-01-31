// import angular from 'angular';
// import 'ovh-ui-angular';

import component from './dedicatedCloud-change-options.component';

const moduleName = 'dedicatedCloudChangeOptions';

angular
  .module(
    moduleName,
    ['oui'],
  )
  .component(
    moduleName,
    component,
  );

export default moduleName;
