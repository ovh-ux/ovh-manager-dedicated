import controller from './configure-users.controller';
import template from './configure-users.html';

export default {
  bindings: {
    usersWhoCanReceiveSMS: '<',
  },
  controller,
  require: {
    stepper: '^ovhManagerComponentStepper',
  },
  template,
};
