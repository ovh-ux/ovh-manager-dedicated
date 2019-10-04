import controller from './public-order.controller';
import template from './public-order.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    alertError: '<',
    serverName: '<',
    specifications: '<',
    user: '<',
  },
};
