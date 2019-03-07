angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicated.server.rendezvous', {
    url: '/rendezvous',
    templateUrl: 'dedicated/server/rendezvous/dedicated-server-rendezvous.html',
    controller: 'DedicatedServerRendezVousCtrl',
    layout: {
      name: 'modal',
      toChilds: true,
    },
  });
});
