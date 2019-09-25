import template from './interfaces.html';
import controller from './interfaces.controller';

export default {
  template,
  controller,
  bindings: {
    serverName: '<',
    specifications: '<',
    interfaces: '<',
    ola: '<',
    urls: '<',
    taskPolling: '<',
  },
};
