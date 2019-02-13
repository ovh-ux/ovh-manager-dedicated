angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.drp.ovh.secondStep', {
    views: {
      'stepView@app.dedicatedClouds.datacenter.drp': {
        component: 'dedicatedCloudDatacenterDrpOvhSecondStep',
      },
    },
    params: {
      currentStep: 2,
      drpInformations: { },
    },
  });
});
