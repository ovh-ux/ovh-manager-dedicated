import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    header: '@',
    orderableServicePacks: '<',
    subheader: '@',
  },
  controller,
  require: {
    stepper: '^dedicatedCloudStepper',
  },
  template,
};
