angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.configuration', {
    url: '/configuration',
    templateUrl: 'configuration/configuration.html',
    controller: 'ConfigurationCtrl',
    controllerAs: '$ctrl',
    translations: ['../common'],
    atInternet: {
      rename: 'Header-Dédié',
    },
  });
});
