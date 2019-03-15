angular
  .module('App')
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app', {
      abstract: true,
      controller: 'AppCtrl',
      controllerAs: 'AppCtrl',
      resolve: {
        currentUser: /* @ngInject */ User => User.getUser(),
      },
      templateUrl: 'app.html',
      translations: ['common', 'double-authentication', 'user-contracts'],
      url: '',
    });

    // CDN & NAS
    $stateProvider.state('app.networks', {
      abstract: true,
      template: '<ui-view />',
      url: '/configuration',
    });

    // Microsoft
    $stateProvider.state('app.microsoft', {
      abstract: true,
      template: '<ui-view />',
    });
  });
