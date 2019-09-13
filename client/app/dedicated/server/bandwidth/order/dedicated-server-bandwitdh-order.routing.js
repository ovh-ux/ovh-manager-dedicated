export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.dashboard.bandwidth', {
    url: '/bandwidth',
    views: {
      modal: {
        component: 'dedicatedServerBandwidthOrder',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
  });
  $stateProvider.state('app.dedicated.server.interfaces.bandwidth', {
    url: '/bandwidth',
    views: {
      modal: {
        component: 'dedicatedServerBandwidthOrder',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
  });
};
