import controller from './servers.controller';
import template from './servers.html';

angular
  .module('App')
  .config(($stateProvider) => {
    const name = 'app.dedicated.servers';

    $stateProvider.state(name, {
      url: '/configuration/servers?page&pageSize&sort&sortOrder&filter',
      template,
      controller,
      controllerAs: '$ctrl',
      translations: { value: ['.', '../'], format: 'json' },
      params: {
        page: {
          value: '1',
          squash: true,
        },
        pageSize: {
          value: '10',
          squash: true,
        },
        sort: {
          value: 'name',
          squash: true,
        },
        sortOrder: {
          value: 'ASC',
          squash: true,
        },
        filter: {
          value: '[]',
          squash: false,
        },
      },
      resolve: {
        dedicatedServers: /* @ngInject */ (iceberg, $stateParams) => {
          const filters = JSON.parse($stateParams.filter);
          let request = iceberg('/dedicated/server')
            .query()
            .expand('CachedObjectList-Pages')
            .limit($stateParams.pageSize)
            .offset($stateParams.page)
            .sort($stateParams.sort, $stateParams.sortOrder);

          filters.forEach(({ field, comparator, reference }) => {
            request = request.addFilter(field, comparator, reference);
          });

          return request.execute(null, true).$promise;
        },
        schema: /* @ngInject */ OvhApiDedicatedServer => OvhApiDedicatedServer
          .v6()
          .schema()
          .$promise,
      },
    });
  });
