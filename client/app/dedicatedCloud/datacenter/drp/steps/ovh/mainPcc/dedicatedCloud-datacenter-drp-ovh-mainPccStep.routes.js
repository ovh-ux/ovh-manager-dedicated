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
    .state('app.dedicatedClouds.datacenter.drp.ovh.mainPccStep.legacyOrderIp', {
      controller: 'IpOrderCtrl',
      templateUrl: 'ip/ip/order/ip-ip-order.html',
      layout: 'modal',
      translations: ['.'],
    })
    .state('app.dedicatedClouds.datacenter.drp.ovh.mainPccStep.orderIp', {
      controller: 'agoraIpOrderCtrl',
      templateUrl: 'ip/ip/agoraOrder/ip-ip-agoraOrder.html',
      layout: 'modal',
      translations: ['.'],
    });
});
