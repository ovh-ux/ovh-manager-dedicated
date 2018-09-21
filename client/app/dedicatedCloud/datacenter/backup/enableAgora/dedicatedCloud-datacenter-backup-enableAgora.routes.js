angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.backup.enableAgora', {
    url: '/enableAgora',
    templateUrl: 'dedicatedCloud/datacenter/backup/enableAgora/dedicatedCloud-datacenter-backup-enableAgora.html',
    controller: 'DedicatedCloudSubDatacenterVeeamBackupEnableAgoraCtrl',
    controllerAs: '$ctrl',
    layout: 'modal',
  });
});
