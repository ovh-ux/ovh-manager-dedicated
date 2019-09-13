import _ from 'lodash';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.interfaces', {
    url: '/interfaces?showSteps&currentStep',
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

      bandwidth: /* @ngInject */ (
        serverName,
        Server,
      ) => Server.getBandwidth(serverName),

      olaInfos: /* @ngInject */ DedicatedServerInterfacesService => DedicatedServerInterfacesService.getOlaInfos(), // eslint-disable-line
      currentStep: /* @ngInject */ $stateParams => (!_.isUndefined($stateParams.currentStep)
        ? parseInt($stateParams.currentStep, 10)
        : 0),
      showSteps: /* @ngInject */ $stateParams => $stateParams.showSteps,
    },
  });
};
