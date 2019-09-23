import controller from './private-order.controller';
import template from './private-order.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    serverName: '<',
    specifications: '<',
    user: '<',
  },
};
