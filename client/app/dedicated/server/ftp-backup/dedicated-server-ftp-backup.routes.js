import template from './dedicated-server-ftp-backup.html';

angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicated.server.ftpBackup', {
    url: '/backup',
    views: {
      'tabView@app.dedicated.server': {
        template,
      },
    },
    translations: ['..'],
  });
});
