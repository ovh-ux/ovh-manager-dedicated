const servicePackToOrder = /* @ngInject */ $transition$ => $transition$
  .params().servicePackToOrder;

export default {
  params: {
    servicePackToOrder: null,
  },
  resolve: {
    servicePackToOrder,
  },
};
