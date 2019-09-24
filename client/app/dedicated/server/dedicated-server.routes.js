import Ola from './interfaces/ola.class';

angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicated.server', {
    url: '/configuration/server/:productId',
    templateUrl: 'dedicated/server/dedicated-server.html',
    controller: 'ServerCtrl',
    reloadOnSearch: false,
    translations: { value: ['.'], format: 'json' },
    redirectTo: 'app.dedicated.server.dashboard',
    resolve: {
      user: /* @ngInject */ User => User.getUser(),
      serverName: /* @ngInject */ $transition$ => $transition$.params().productId,
      interfaces: /* @ngInject */ (
        serverName,
        DedicatedServerInterfacesService,
      ) => DedicatedServerInterfacesService.getInterfaces(serverName),
      specifications: /* @ngInject */ (serverName, Server) => Server.getBandwidth(serverName),
      ola: /* @ngInject */ (
        interfaces,
        specifications,
        $stateParams,
      ) => new Ola({
        interfaces,
        ...specifications.ola,
        ...$stateParams,
      }),
    },
  });
});
