angular.module('App')
  .config(($stateProvider) => {
    $stateProvider.state('app.dedicated.server.dashboard.reboot', {
      url: '/reboot',
      templateUrl: 'dedicated/server/reboot/dedicated-server-reboot.html',
      controller: 'DedicatedServerRebootCtrl',
      controllerAs: '$ctrl',
      layout: 'modal',
    });
  });
