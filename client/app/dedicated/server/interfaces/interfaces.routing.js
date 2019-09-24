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
      urls: /* @ngInject */ (
        constants,
        user,
      ) => constants.urls[user.ovhSubsidiary],
    },
  });
};
