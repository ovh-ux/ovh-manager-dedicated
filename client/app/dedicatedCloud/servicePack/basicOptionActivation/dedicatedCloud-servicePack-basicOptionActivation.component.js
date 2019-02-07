import controller from './dedicatedCloud-servicePack-basicOptionActivation.controller';
import template from './dedicatedCloud-servicePack-basicOptionActivation.template.html';

export default {
  bindings: {
    currentService: '<',
    orderableServicePacks: '<',
  },
  controller,
  template,
};
