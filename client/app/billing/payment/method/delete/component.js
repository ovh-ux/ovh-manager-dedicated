import controller from './controller';
import template from './index.html';

export default {
  name: 'billingPaymentMethodDelete',
  controller,
  template,
  bindings: {
    modalInstance: '<',
    resolve: '<',
  },
};
