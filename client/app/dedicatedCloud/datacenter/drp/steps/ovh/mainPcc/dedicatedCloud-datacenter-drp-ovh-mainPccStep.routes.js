angular.module('App').config(/* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.dedicatedClouds.datacenter.drp.ovh.mainPccStep', {
      views: {
        'stepView@app.dedicatedClouds.datacenter.drp': {
          component: 'dedicatedCloudDatacenterDrpOvhMainPccStep',
        },
      },
      params: {
        currentStep: 1,
        drpInformations: { },
      },
    })
    .state('app.dedicatedClouds.datacenter.drp.ovh.mainPccStep.orderIp', {
      controller: 'IpOrderCtrl',
      templateUrl: 'ip/ip/order/ip-ip-order.html',
      layout: 'modal',
      translations: ['.'],
    });
});
