angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.ssl.delete', {
    url: '/delete',
    templateUrl: 'cdn/dedicated/manage/ssl/delete/cdn-dedicated-ssl-delete.html',
    controller: 'CdnDeleteSslCtrl',
    layout: 'modal',
    translations: ['cdn/dedicated/manage/ssl/delete'],
  });
});
