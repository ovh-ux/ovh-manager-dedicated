import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    currentService: '<',
    header: '@',
    hasDefaultMeansOfPayment: '<',
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
