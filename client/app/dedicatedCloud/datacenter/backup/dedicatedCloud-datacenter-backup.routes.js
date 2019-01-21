angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.backup', {
    url: '/backup',
    reloadOnSearch: false,
    views: {
      pccDatacenterView: {
        templateUrl: 'dedicatedCloud/datacenter/backup/dedicatedCloud-datacenter-backup.html',
        controller: 'DedicatedCloudSubDatacenterVeeamCtrl',
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      veeam: /* @ngInject */ (
        $stateParams,
        DedicatedCloud,
      ) => DedicatedCloud.getVeeam(
        $stateParams.productId,
        $stateParams.datacenterId,
        true,
      ),
    },
  });
});
