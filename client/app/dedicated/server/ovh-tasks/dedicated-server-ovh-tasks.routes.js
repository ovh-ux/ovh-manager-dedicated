angular
  .module('App')
  .config(($stateProvider) => {
    $stateProvider.state('app.dedicated.server.ovh-tasks', {
      url: '/ovh-tasks',
      component: 'dedicatedServerOVHTasks',
      translations: ['../ovh-tasks'],
    });
  });
