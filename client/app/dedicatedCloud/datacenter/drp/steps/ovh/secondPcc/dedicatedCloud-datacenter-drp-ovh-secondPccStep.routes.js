angular.module('App').config(($stateProvider) => {
  $stateProvider
    .state('app.dedicatedClouds.datacenter.drp.ovh.secondPccStep', {
      views: {
        'stepView@app.dedicatedClouds.datacenter.drp': {
          component: 'dedicatedCloudDatacenterDrpOvhSecondPccStep',
        },
      },
      params: {
        currentStep: 2,
        drpInformations: { },
      },
    })
    .state('app.dedicatedClouds.datacenter.drp.ovh.secondPccStep.orderIp', {
      controller: 'IpOrderCtrl',
      templateUrl: 'ip/ip/order/ip-ip-order.html',
      layout: 'modal',
      translations: ['.'],
    });
});
