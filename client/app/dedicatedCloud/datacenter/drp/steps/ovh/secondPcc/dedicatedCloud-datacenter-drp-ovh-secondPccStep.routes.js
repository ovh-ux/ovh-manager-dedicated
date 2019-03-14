angular.module('App').config(/* @ngInject */ ($stateProvider) => {
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
    })
    .state('app.dedicatedClouds.datacenter.drp.ovh.secondPccStep.agoraOrderIp', {
      controller: 'agoraIpOrderCtrl',
      templateUrl: 'ip/ip/agoraOrder/ip-ip-agoraOrder.html',
      layout: 'modal',
      translations: ['.'],
    });
});
