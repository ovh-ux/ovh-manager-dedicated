export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.interfaces', {
    url: '/interfaces',
    views: {
      'tabView@app.dedicated.server': {
        component: 'dedicatedServerInterfaces',
      },
    },
    translations: { value: ['.'], format: 'json' },
    resolve: {
      serverName: /* @ngInject */ $transition$ => $transition$.params().productId,
      interfaces: /* @ngInject */ (
        serverName,
        DedicatedServerInterfacesService,
      ) => DedicatedServerInterfacesService.getInterfaces(serverName),
      bandwidth: /* @ngInject */ (
        serverName,
        Server,
      ) => Server.getBandwidth(serverName),
    },
  });
};
