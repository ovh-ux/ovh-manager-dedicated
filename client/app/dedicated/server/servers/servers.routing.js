import controller from './servers.controller';
import template from './servers.html';

angular
  .module('App')
  .config(($stateProvider) => {
    const name = 'app.dedicated.servers';

    $stateProvider.state(name, {
      url: '/configuration/servers',
      template,
      controller,
      controllerAs: '$ctrl',
      translations: ['./'],
      resolve: {
        dedicatedServers: /* @ngInject */ iceberg => iceberg('/dedicated/server')
          .query()
          .expand('CachedObjectList-Pages')
          .sort('name', 'DESC')
          .execute(null, true)
          .$promise,
      },
    });
  });
