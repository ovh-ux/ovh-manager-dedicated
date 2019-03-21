angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter', {
    url: '/datacenter/:datacenterId',
    views: {
      dedicatedCloudView: {
        templateUrl: 'dedicatedCloud/datacenter/dedicatedCloud-datacenter.html',
        controller: 'DedicatedCloudSubDatacenterCtrl',
        controllerAs: '$ctrl',
      },
      'pccDatacenterView@app.dedicatedClouds.datacenter': {
        templateUrl: 'dedicatedCloud/datacenter/dashboard/dedicatedCloud-datacenter-dashboard.html',
      },
    },
  });
});
