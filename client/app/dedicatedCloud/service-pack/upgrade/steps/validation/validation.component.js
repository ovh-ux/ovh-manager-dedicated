import controller from './validation.controller';
import template from './validation.html';

export default {
  bindings: {
    hasDefaultMeansOfPayment: '<',
    usersWhoCanReceiveSMS: '<',
  },
  controller,
  name: 'ovhManagerPccServicePackUpgradeValidation',
  require: {
    stepper: '^ovhManagerComponentStepper',
  },
  template,
};
