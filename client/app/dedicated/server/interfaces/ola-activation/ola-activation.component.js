import controller from './ola-activation.controller';
import template from './ola-activation.html';

export default {
  bindings: {
    goBack: '<',
    serverName: '<',
    user: '<',
  },
  controller,
  template,
};