angular.module('App')
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('app.disable-order', {
      url: '/disable-order',

      translations: ['.'],
      layout: 'modal',
      views: {
        modal: {
          controller: 'DisableOrderCtrl',
          templateUrl: 'disable-order/disable-order.html',
        },
      },
    });
  });
