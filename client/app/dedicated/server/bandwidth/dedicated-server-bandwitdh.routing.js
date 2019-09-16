export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.dashboard.bandwidth-public', {
    url: '/bandwidth-public',
    views: {
      modal: {
        component: 'dedicatedServerPublicBandwidthOrder',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
  });
  $stateProvider.state('app.dedicated.server.dashboard.bandwidth-public-cancel', {
    url: '/bandwidth-public-cancel',
    views: {
      modal: {
        component: 'dedicatedServerPublicBandwidthCancel',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
  });
  $stateProvider.state('app.dedicated.server.dashboard.bandwidth-private', {
    url: '/bandwidth-private',
    views: {
      modal: {
        component: 'dedicatedServerPrivateBandwidthOrder',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
  });
  $stateProvider.state('app.dedicated.server.dashboard.bandwidth-private-cancel', {
    url: '/bandwidth-private-cancel',
    views: {
      modal: {
        component: 'dedicatedServerPrivateBandwidthCancel',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
  });
  $stateProvider.state('app.dedicated.server.interfaces.bandwidth-public', {
    url: '/bandwidth-public',
    views: {
      modal: {
        component: 'dedicatedServerPublicBandwidthOrder',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
  });
  $stateProvider.state('app.dedicated.server.interfaces.bandwidth-public-cancel', {
    url: '/bandwidth-public-cancel',
    views: {
      modal: {
        component: 'dedicatedServerPublicBandwidthCancel',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
  });
  $stateProvider.state('app.dedicated.server.interfaces.bandwidth-private', {
    url: '/bandwidth-private',
    views: {
      modal: {
        component: 'dedicatedServerPrivateBandwidthOrder',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
  });
  $stateProvider.state('app.dedicated.server.interfaces.bandwidth-private-cancel', {
    url: '/bandwidth-private-cancel',
    views: {
      modal: {
        component: 'dedicatedServerPrivateBandwidthCancel',
      },
    },
    layout: 'modal',
    translations: { value: ['.'], format: 'json' },
  });
};
