export default /* @ngInject */ ($stateProvider) => {
  const name = 'app.account.user.support-level';

  $stateProvider.state(name, {
    url: '/support/level',
    component: 'accountUserSupportLevel',
    translations: {
      format: 'json',
      value: ['./'],
    },
    resolve: {
      schema: /* @ngInject */ OvhApiMe => OvhApiMe
        .v6()
        .schema()
        .$promise,
      supportLevel: /* @ngInject */ OvhApiMe => OvhApiMe
        .v6()
        .supportLevel()
        .$promise,
    },
  });
};
