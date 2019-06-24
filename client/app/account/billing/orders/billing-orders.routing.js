import controller from './billing-orders.controller';
import template from './billing-orders.html';

angular
  .module('Billing')
  .config(($stateProvider) => {
    const name = 'app.account.billing.orders';

    $stateProvider.state(name, {
      url: '/orders',
      template,
      controller,
      controllerAs: '$ctrl',
      translations: { value: ['.', '../'], format: 'json' },
      resolve: {
        orders: /* @ngInject */ iceberg => iceberg('/me/order')
          .query()
          .expand('CachedObjectList-Pages')
          .sort('date', 'DESC')
          .limit(5000)
          .execute(null, true)
          .$promise,
        schema: /* @ngInject */ OvhApiMe => OvhApiMe
          .v6()
          .schema()
          .$promise,
      },
    });
  });
