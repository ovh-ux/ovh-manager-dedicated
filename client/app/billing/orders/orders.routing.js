import controller from './billing-orders.controller';
import template from './billing-orders.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.orders', {
    url: '/orders?filter',
    params: {
      filter: {
        dynamic: true,
      },
    },
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
        .$promise
        .then(({ data }) => data),
      filter: /* @ngInject */ $transition$ => $transition$.params().filter,
      criteria: /* @ngInject */ ($log, filter) => {
        if (filter) {
          try {
            const criteria = JSON.parse(decodeURIComponent(filter));
            if (!Array.isArray(criteria)) throw new Error('Invalid criteria');
            return criteria;
          } catch (err) {
            $log.error(err);
          }
        }
        return undefined;
      },
      schema: /* @ngInject */ OvhApiMe => OvhApiMe
        .v6()
        .schema()
        .$promise,
      goToOrder: /* @ngInject */ $state => (order, filter) => $state.go('app.account.billing.order', {
        orderId: order.orderId,
        ordersFilter: filter,
      }),
      updateFilterParam: /* @ngInject */ $state => filter => $state.go('app.account.billing.orders', {
        filter,
      }, {
        reload: false,
      }),
    },
  });
};
