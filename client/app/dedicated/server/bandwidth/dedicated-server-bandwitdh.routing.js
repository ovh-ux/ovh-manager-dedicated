export default /* @ngInject */ ($stateProvider) => {
  const parentStates = [
    'app.dedicated.server.dashboard',
    'app.dedicated.server.interfaces',
  ];
  const states = [{
    name: 'bandwidth-public-order',
    url: '/bandwidth-public-order',
    component: 'dedicatedServerPublicBandwidthOrder',
  }, {
    name: 'bandwidth-public-cancel',
    url: '/bandwidth-public-cancel',
    component: 'dedicatedServerPublicBandwidthCancel',
  }, {
    name: 'bandwidth-private-order',
    url: '/bandwidth-private-order',
    component: 'dedicatedServerPrivateBandwidthOrder',
  }, {
    name: 'bandwidth-private-cancel',
    url: '/bandwidth-private-cancel',
    component: 'dedicatedServerPrivateBandwidthCancel',
  }];

  parentStates.forEach(
    parent => states.forEach(
      ({
        name,
        url,
        component,
      }) => {
        $stateProvider.state(`${parent}.${name}`, {
          url,
          views: {
            modal: {
              component,
            },
          },
          layout: 'modal',
          translations: { value: ['.'], format: 'json' },
        });
      },
    ),
  );
};
