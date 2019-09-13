import controller from './dedicated-server-bandwidth-order.controller';
import template from './dedicated-server-bandwidth-order.html';

export default {
  controller,
  template,
  bindings: {
    serverName: '<',
    bandwidth: '<',
    user: '<',
  },
};
