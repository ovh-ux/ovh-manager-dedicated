angular
  .module('App')
  .config(($stateProvider, constants) => {
    if (constants.target === 'US') {
      $stateProvider.state('app.dedicatedClouds.license.enable', {
        controller: 'DedicatedCloudLicencesSplaEnableUSCtrl',
        controllerAs: '$ctrl',
        layout: 'modal',
        templateUrl: 'dedicatedCloud/license/enable/dedicatedCloud-license-enable-us.html',
        url: '/enable',
      });
    }
  });
