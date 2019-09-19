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
      serverName: /* @ngInject */ $transition$ => $transition$.params().productId,
      specifications: /* @ngInject */ (serverName, Server) => Server.getBandwidth(serverName),
      user: /* @ngInject */ User => User.getUser(),
      ola: /* @ngInject */ (
        specifications,
        $stateParams,
      ) => new Ola({
        ...specifications.ola,
        ...$stateParams,
      }),
    },
  });
});
