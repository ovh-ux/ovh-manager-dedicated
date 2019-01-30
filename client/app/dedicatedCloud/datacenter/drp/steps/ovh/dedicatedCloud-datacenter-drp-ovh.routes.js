angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.drp.ovh', {
    url: '',
    abstract: true,
    views: {
      'progressTrackerView@app.dedicatedClouds.datacenter.drp': {
        templateUrl: 'dedicatedCloud/datacenter/drp/steps/ovh/dedicatedCloud-datacenter-drp-ovh.html',
      },
    },
    redirectTo: 'app.dedicatedClouds.datacenter.drp.ovh.firstStep',
  });
});
