import controller from './dedicated-server-bandwidth-vrack.controller';
import template from './dedicated-server-bandwidth-vrack.html';

export default {
  controller,
  template,
  bindings: {
    specifications: '<',
    serverName: '<',
    user: '<',
  },
};
