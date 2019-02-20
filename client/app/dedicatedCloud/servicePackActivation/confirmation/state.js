const hasDefaultMeansOfPayment = /* @ngInject */ ovhPaymentMethod => ovhPaymentMethod
  .hasDefaultPaymentMethod();

const servicePackToOrder = /* @ngInject */ $transition$ => $transition$
  .params().servicePackToOrder;

export default {
  params: {
    servicePackToOrder: null,
  },
  resolve: {
    hasDefaultMeansOfPayment,
    servicePackToOrder,
  },
};
