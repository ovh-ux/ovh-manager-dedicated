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
      interfaces: /* @ngInject */ (
        serverName,
        DedicatedServerInterfacesService,
      ) => DedicatedServerInterfacesService.getInterfaces(serverName),
    },
  });
};
