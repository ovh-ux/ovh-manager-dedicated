angular
  .module('Module.license')
  .config(($stateProvider) => {
    $stateProvider.state('app.license', {
      abstract: true,
      url: '/configuration/license',
      template: '<ui-view/>',
      translations: ['license'],
    });
    $stateProvider.state('app.license.dashboard', {
      url: '',
      templateUrl: 'license/license.html',
      controller: 'LicenseCtrl',
    });
  });
