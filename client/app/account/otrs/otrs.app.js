angular
  .module('Module.otrs', ['ovh-utils-angular', 'ngRoute', 'ui.bootstrap', 'Module.otrs.controllers', 'Module.otrs.directives', 'Module.otrs.services', 'Module.otrs.filters'])
  .config(($stateProvider) => {
    $stateProvider.state('app.account.otrs-ticket', {
      url: '/ticket',
      templateUrl: 'account/otrs/otrs.html',
      controller: 'otrsCtrl',
      translations: ['../otrs'],
    });

    $stateProvider.state('app.account.otrs-ticket-details', {
      url: '/ticket/:ticketId',
      templateUrl: 'account/otrs/detail/otrs-detail.html',
      controller: 'otrsDetailCtrl',
      translations: ['../otrs'],
    });
  })
  .run([
    'Module.otrs.services.otrs',
    function (Otrs) {
      Otrs.init();
    },
  ]);
