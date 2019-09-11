export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.interfaces.ola', {
    url: '/ola',
    translations: { value: ['.'], format: 'json' },
    views: {
      'tabView@app.dedicated.server': {
        component: 'dedicatedServerInterfacesOla',
      },
    },
    resolve: {
      goBack: /* @ngInject */ $state => () => $state.go('app.dedicated.server.interfaces'),
    },
  });
};
