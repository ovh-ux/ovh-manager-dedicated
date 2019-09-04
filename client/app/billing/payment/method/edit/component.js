import controller from './controller';
import template from './index.html';

export default {
  name: 'billingPaymentMethodEdit',
  controller,
  template,
  bindings: {
    modalInstance: '<',
    resolve: '<',
  },
};
