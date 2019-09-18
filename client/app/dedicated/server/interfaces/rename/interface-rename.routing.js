export default /* @ngInject */ ($stateProvider) => {
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
    resolve: {
      goBack: /* @ngInject */ $state => () => $state.go('^'),
      interface: /* @ngInject */ $stateParams => $stateParams.interface,
    },
  });
};
