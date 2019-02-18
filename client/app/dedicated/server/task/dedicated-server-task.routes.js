import template from './dedicated-server-task.html';

angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicated.server.task', {
    url: '/task',
    views: {
      'tabView@app.dedicated.server': {
        template,
      },
    },
    translations: ['..'],
  });
});
