import angular from 'angular';

import 'ovh-angular-user-pref';

import DucNotification from './notification.service';

const moduleName = 'ducNotification';

angular
  .module(moduleName, [
    'ovh-angular-user-pref',
  ])
  .service('DucNotification', DucNotification);

export default moduleName;
