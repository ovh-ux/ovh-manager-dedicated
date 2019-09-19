import Ola from './ola.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.interfaces', {
    url: '/interfaces?:configStep',
    views: {
      'tabView@app.dedicated.server': {
        component: 'dedicatedServerInterfaces',
      },
    },
    translations: { value: ['.'], format: 'json' },
    params: {
      configStep: { dynamic: true },
    },
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

      urls: /* @ngInject */ (
        constants,
        user,
      ) => constants.urls[user.ovhSubsidiary],
    },
  });
};
