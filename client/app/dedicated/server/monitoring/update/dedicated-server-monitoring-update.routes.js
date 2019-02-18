angular.module('App')
  .config(($stateProvider) => {
    $stateProvider.state('app.dedicated.server.dashboard.monitoringUpdate', {
      url: '/monitoring/update',
      templateUrl: 'dedicated/server/monitoring/update/dedicated-server-monitoring-update.html',
      controller: 'DedicatedServerMonitoringUpdateCtrl',
      controllerAs: '$ctrl',
      layout: 'modal',
    });
  });
