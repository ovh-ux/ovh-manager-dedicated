import template from './dedicated-server-dns.html';

angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicated.server.dns', {
    url: '/dns',
    views: {
      'tabView@app.dedicated.server': {
        template,
      },
    },
    translations: ['..'],
  });
});
