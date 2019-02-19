angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.drp.ovh.confirmationStep', {
    views: {
      'stepView@app.dedicatedClouds.datacenter.drp': {
        component: 'dedicatedCloudDatacenterDrpOvhConfirmationStep',
      },
    },
    params: {
      currentStep: 3,
      drpInformations: { },
    },
  });
});
