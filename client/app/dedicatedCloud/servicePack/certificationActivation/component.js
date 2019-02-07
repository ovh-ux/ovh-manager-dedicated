import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    currentService: '<',
    orderableServicePacks: '<',
  },
  controller,
  name: 'dedicatedCloudServicePackCertificationActivation',
  template,
};
