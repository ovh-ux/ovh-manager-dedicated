angular
  .module('App')
  .config(($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.datacenter.backup.enable', {
      url: '/enable',
      templateUrl: 'dedicatedCloud/datacenter/backup/enable/dedicatedCloud-datacenter-backup-enable.html',
      controller: 'DedicatedCloudSubDatacenterVeeamBackupEnableCtrl',
      controllerAs: '$ctrl',
      layout: 'modal',
    });
  });
