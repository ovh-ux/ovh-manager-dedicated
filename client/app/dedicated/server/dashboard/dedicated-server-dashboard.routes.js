import template from './dedicated-server-dashboard.html';

angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicated.server.dashboard', {
    url: '',
    views: {
      'tabView@app.dedicated.server': {
        template,
      },
    },
    translations: ['..'],
  });
});
