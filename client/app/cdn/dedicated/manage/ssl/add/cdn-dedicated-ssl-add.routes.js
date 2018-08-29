angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.ssl.add', {
    url: '/add',
    templateUrl: 'cdn/dedicated/manage/ssl/add/cdn-dedicated-ssl-add.html',
    controller: 'CdnAddSslCtrl',
    layout: 'modal',
    translations: ['cdn/dedicated/manage/ssl/add'],
  });
});
