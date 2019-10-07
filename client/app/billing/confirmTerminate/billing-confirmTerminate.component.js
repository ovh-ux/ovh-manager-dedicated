import controller from './billing-confirmTerminate.controller';
import template from './billing-confirmTerminate.html';

export default {
  bindings: {
    currentUser: '<',
  },
  controller,
  template,
};
