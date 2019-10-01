import template from './interfaces.html';
import controller from './interfaces.controller';

export default {
  template,
  controller,
  bindings: {
    failoverIps: '<',
    interfaces: '<',
    ola: '<',
    optionPrice: '<',
    serverName: '<',
    specifications: '<',
    taskPolling: '<',
    urls: '<',
    user: '<',
  },
};
