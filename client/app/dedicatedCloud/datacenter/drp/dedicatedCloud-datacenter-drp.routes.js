angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.drp', {
    url: '/drp',
    views: {
      'pccDatacenterView@app.dedicatedClouds.datacenter': {
        component: 'dedicatedCloudDatacenterDrp',
      },
    },
    translations: ['../../../ip'],
    params: {
      selectedDrpType: null,
    },
  });
});
