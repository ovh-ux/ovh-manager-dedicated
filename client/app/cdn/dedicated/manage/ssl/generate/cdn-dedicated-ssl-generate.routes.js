angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.networks.cdn.dedicated.ssl.generate', {
    url: '/generate',
    templateUrl: 'cdn/dedicated/manage/ssl/generate/cdn-dedicated-ssl-generate.html',
    controller: 'CdnGenerateSslCtrl',
    layout: 'modal',
    translations: ['cdn/dedicated/manage/ssl/generate'],
  });
});
