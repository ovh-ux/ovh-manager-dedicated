import controller from './dedicated-server-bandwidth-vrack-cancel.controller';
import template from './dedicated-server-bandwidth-vrack-cancel.html';

export default {
  controller,
  template,
  bindings: {
    serverName: '<',
    user: '<',
  },
};
