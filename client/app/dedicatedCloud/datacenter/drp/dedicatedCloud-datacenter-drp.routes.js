angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.drp', {
    url: '/drp',
    views: {
      'pccDatacenterView@app.dedicatedClouds.datacenter': 'dedicatedCloudDatacenterDrp',
    },
    params: {
      selectedDrpType: null,
    },
    resolve: {
      datacenterHosts: /* @ngInject */ ($stateParams, DedicatedCloud) => DedicatedCloud
        .getHosts($stateParams.productId, $stateParams.datacenterId),
      datacenterList: /* @ngInject */ ($stateParams, DedicatedCloud) => DedicatedCloud
        .getDatacenters($stateParams.productId).then(({ results }) => results),
      pccList: /* @ngInject */ DedicatedCloud => DedicatedCloud.getAllPccs(),
      pccPlan: /* @ngInject */ ($stateParams, DedicatedCloudDrp) => DedicatedCloudDrp
        .getPccDrpPlan($stateParams.productId),
    },
  });
});
