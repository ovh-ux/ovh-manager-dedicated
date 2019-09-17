import Ola from './ola.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.interfaces', {
    url: '/interfaces?configStep&isOlaActivated&isOlaConfigured', // TODO: isOlaActivated && isOlaConfigured are for mockup purpose
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

      specifications: /* @ngInject */ (
        serverName,
        Server,
      ) => Server.getBandwidth(serverName),

      ola: /* @ngInject */ (
        specifications,
        $stateParams,
      ) => new Ola({
        ...specifications.ola,
        ...$stateParams,
      }),

    },
  });
  $stateProvider.state('app.dedicated.server.interfaces.rename', {
    url: '/rename',
    views: {
      modal: {
        component: 'dedicatedServerInterfacesRename',
      },
    },
    params: {
      interface: null,
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
  });
  $stateProvider.state('app.dedicated.server.interfaces.attach', {
    url: '/attach',
    views: {
      modal: {
        component: 'dedicatedServerInterfacesAttach',
      },
    },
    params: {
      interface: null,
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
  });
};
