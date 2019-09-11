import controller from './interfaces.controller';
import template from './interfaces.html';

export default {
  controller,
  template,
  bindings: {
    serverName: '<',
    interfaces: '<',
  },
};
