import _ from 'lodash';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.dedicated.servers';

  $stateProvider.state(name, {
    url: '/configuration/servers?page&pageSize&sort&sortOrder&filter',
    component: 'dedicatedServerServers',
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
      filter: /* @ngInject */ $transition$ => $transition$.params().filter,
      orderUrl: /* @ngInject */ User => User.getUrlOf('dedicatedOrder'),
      getServerDashboardLink: /* @ngInject */ $state => server => $state.href('app.dedicated.server', { productId: server.name }),

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
      paginationNumber: /* @ngInject */ dedicatedServers => _.get(dedicatedServers.headers, 'x-pagination-number'),
      paginationSize: /* @ngInject */ dedicatedServers => _.get(dedicatedServers.headers, 'x-pagination-size'),
      paginationTotalCount: /* @ngInject */ dedicatedServers => _.get(dedicatedServers.headers, 'x-pagination-elements'),

      schema: /* @ngInject */ OvhApiDedicatedServer => OvhApiDedicatedServer
        .v6()
        .schema()
        .$promise,
      serverStateEnum: /* @ngInject */ schema => _.get(schema.models, 'dedicated.server.StateEnum').enum,
      datacenterEnum: /* @ngInject */ schema => _.get(schema.models, 'dedicated.DatacenterEnum').enum,

      onListParamsChange: /* @ngInject */ $state => params => $state.go(
        '.',
        params,
        {
          notify: false,
        },
      ),
    },
  });
};