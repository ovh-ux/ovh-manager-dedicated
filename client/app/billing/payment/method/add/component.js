import controller from './controller';
import template from './index.html';

export default {
  name: 'billingPaymentMethodAdd',
  controller,
  template,
  bindings: {
    addSteps: '<',
    currentUser: '<',
    isLastStep: '<',
    getBackButtonHref: '<',
    model: '<',
    onPaymentMethodAdded: '<',
    paymentMethods: '<',
  },
};
