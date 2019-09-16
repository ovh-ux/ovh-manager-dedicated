import controller from './ola-configuration.controller';
import template from './ola-configuration.html';

export default {
  bindings: {
    goBack: '<',
    bandwidth: '<',
    interfaces: '<',
  },
  controller,
  template,
};
