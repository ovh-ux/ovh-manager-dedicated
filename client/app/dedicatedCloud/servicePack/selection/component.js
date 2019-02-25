import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    currentService: '<',
    header: '@',
    orderableServicePacks: '<',
    servicePacks: '<',
    subheader: '@',
  },
  controller,
  require: {
    stepper: '^dedicatedCloudStepper',
  },
  template,
};
