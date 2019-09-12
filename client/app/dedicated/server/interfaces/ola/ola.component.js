import controller from './ola.controller';
import template from './ola.html';

export default {
  bindings: {
    goBack: '<',
    bandwidth: '<',
    interfaces: '<',
  },
  controller,
  template,
};
