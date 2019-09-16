import controller from './dedicated-server-bandwidth-cancel.controller';
import template from './dedicated-server-bandwidth-cancel.html';

export default {
  controller,
  template,
  bindings: {
    serverName: '<',
  },
};
