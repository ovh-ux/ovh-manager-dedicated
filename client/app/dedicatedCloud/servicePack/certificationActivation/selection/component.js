import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    orderableServicePacks: '<',
  },
  controller,
  require: {
    stepper: '^dedicatedCloudServicePackCertificationActivation',
  },
  template,
};
