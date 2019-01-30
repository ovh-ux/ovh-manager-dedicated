angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.drp.ovh.finalStep', {
    url: '',
    views: {
      'stepView@app.dedicatedClouds.datacenter.drp': {
        component: 'dedicatedCloudDatacenterDrpOvhFinalStep',
      },
    },
    params: {
      currentStep: 3,
      drpInformations: { },
    },
  });
});
