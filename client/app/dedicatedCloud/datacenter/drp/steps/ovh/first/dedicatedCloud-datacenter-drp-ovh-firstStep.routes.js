angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.drp.ovh.firstStep', {
    views: {
      'stepView@app.dedicatedClouds.datacenter.drp': {
        component: 'dedicatedCloudDatacenterDrpOvhFirstStep',
      },
    },
    params: {
      currentStep: 1,
      drpInformations: { },
    },
  });
});
