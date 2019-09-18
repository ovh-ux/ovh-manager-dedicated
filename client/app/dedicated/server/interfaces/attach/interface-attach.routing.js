export default /* @ngInject */ ($stateProvider) => {
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
    resolve: {
      goBack: $state => () => $state.go('^'),
      interface: /* @ngInject */ $stateParams => $stateParams.interface,
    },
  });
};
