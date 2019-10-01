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
      failoverIps: /* @ngInject */ (
        OvhApiIp,
        serverName,
      ) => OvhApiIp.v6().query({
        'routedTo.serviceName': serverName,
        type: 'failover',
      }).$promise,
      taskPolling: /* @ngInject */ (
        DedicatedServerInterfacesService,
        serverName,
      ) => DedicatedServerInterfacesService.getTasks(serverName),
      alertError: /* @ngInject */ (
        $timeout,
        $translate,
        Alerter,
      ) => (translateId, error) => $timeout(() => {
        Alerter.set('alert-danger', $translate.instant(translateId, { error: error.message }));
      }),
      optionPrice: /* @ngInject */ (
        DedicatedServerInterfacesService,
        serverName,
      ) => DedicatedServerInterfacesService.getOlaPrice(serverName),
      urls: /* @ngInject */ (
        constants,
        user,
      ) => constants.urls[user.ovhSubsidiary],
    },
  });
};
