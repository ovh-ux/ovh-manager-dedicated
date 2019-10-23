import controller from './mfaEnrollment.controller';
import template from './mfaEnrollment.html';

export default {
  bindings: {
    from: '<',
    rootState: '<',
  },
  controller,
  template,
};
