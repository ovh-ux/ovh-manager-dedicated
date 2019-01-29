// import angular from 'angular';
// import 'ovh-ui-angular';

import component from './dedicatedCloud-dashboard.component';

const moduleName = 'dedicatedCloudDashboard';

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
