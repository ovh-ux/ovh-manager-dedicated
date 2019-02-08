import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    currentService: '<',
    currentUser: '<',
    servicePacks: '<',
  },
  controller,
  template,
};