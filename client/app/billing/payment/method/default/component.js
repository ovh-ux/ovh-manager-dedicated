import controller from './controller';
import template from './index.html';

export default {
  name: 'billingPaymentMethodDefault',
  controller,
  template,
  bindings: {
    modalInstance: '<',
    resolve: '<',
  },
};
