import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    currentService: '<',
    currentUser: '<',
    hasDefaultMeansOfPayment: '<',
    servicePackToOrder: '<',
  },
  controller,
  template,
};
