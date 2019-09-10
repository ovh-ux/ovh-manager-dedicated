import template from './dedicated-server-interfaces.html';

angular.module('App').config(/* @ngInject */($stateProvider) => {
  $stateProvider.state('app.dedicated.server.interfaces', {
    url: '/interfaces',
    views: {
      'tabView@app.dedicated.server': {
        template,
      },
    },
    translations: { value: ['..'], format: 'json' },
  });
});
