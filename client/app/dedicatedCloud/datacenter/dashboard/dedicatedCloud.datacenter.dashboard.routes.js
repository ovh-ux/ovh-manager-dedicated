angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.dashboard', {
    url: '',
    views: {
      'pccDatacenterView@app.dedicatedClouds.datacenter': {
        templateUrl: 'dedicatedCloud/datacenter/dashboard/dedicatedCloud-datacenter-dashboard.html',
      },
    },
  });
});
