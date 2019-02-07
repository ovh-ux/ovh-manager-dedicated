import controller from './dedicatedCloud-dashboard.controller';
import template from './dedicatedCloud-dashboard.template.html';

export default {
  bindings: {
    currentService: '<',
    currentUser: '<',
    servicePacks: '<',
  },
  controller,
  template,
};
