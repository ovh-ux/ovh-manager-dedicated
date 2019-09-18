import controller from './ola-activation.controller';
import template from './ola-activation.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    user: '<',
  },
  controller,
  template,
};
