import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    currentService: '<',
    currentUser: '<',
    servicePackToOrder: '<',
  },
  controller,
  require: {
    stepper: '^dedicatedCloudStepper',
  },
  template,
};
