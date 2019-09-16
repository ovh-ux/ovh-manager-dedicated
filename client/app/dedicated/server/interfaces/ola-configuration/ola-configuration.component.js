import controller from './ola-configuration.controller';
import template from './ola-configuration.html';

export default {
  bindings: {
    goBack: '<',
    specifications: '<',
    interfaces: '<',
  },
  controller,
  template,
};
