export default /* @ngInject */ ($stateProvider) => {
  // Parent states where the modal could be called
  const parentStates = [
    'app.dedicated.server.dashboard',
    'app.dedicated.server.interfaces',
  ];

  parentStates.forEach(
    (parent) => {
      $stateProvider.state(`${parent}.bandwidth-public-cancel`, {
        url: '/bandwidth-public-cancel',
        views: {
          modal: {
            component: 'dedicatedServerPublicBandwidthCancel',
          },
        },
        layout: 'modal',
        translations: { value: ['.'], format: 'json' },
        resolve: {
          goBack: /* @ngInject */ $state => () => $state.go('^'),
        },
      });
    },
  );
};
