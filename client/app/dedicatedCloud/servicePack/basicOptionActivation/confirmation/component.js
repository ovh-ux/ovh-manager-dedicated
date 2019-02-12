import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    currentService: '<',
    hasDefaultMeansOfPayment: '<',
    nameOfServicePackToOrder: '<',
  },
  controller,
  template,
};
