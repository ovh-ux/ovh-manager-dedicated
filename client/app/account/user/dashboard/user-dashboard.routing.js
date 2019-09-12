import controller from './user-dashboard.controller';
import template from './user-dashboard.html';

angular
  .module('UserAccount')
  .config(($stateProvider) => {
    const name = 'app.account.user.dashboard';

    $stateProvider.state(name, {
      url: '/dashboard',
      template,
      controller,
      controllerAs: '$ctrl',
      translations: {
        format: 'json',
        value: ['./', '../support-level'],
      },
      resolve: {
        user: /* @ngInject */ OvhApiMe => OvhApiMe
          .v6()
          .get()
          .$promise,
        supportLevel: /* @ngInject */ OvhApiMe => OvhApiMe
          .v6()
          .supportLevel()
          .$promise,
        lastBill: /* @ngInject */ iceberg => iceberg('/me/bill')
          .query()
          .expand('CachedObjectList-Pages')
          .sort('date', 'DESC')
          .limit(1)
          .execute(null, true)
          .$promise,
      },
    });
  });