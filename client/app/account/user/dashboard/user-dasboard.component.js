import controller from './user-dashboard.controller';
import template from './user-dashboard.html';

export default {
  bindings: {
    lastBill: '<',
    supportLevel: '<',
    user: '<',
  },
  controller,
  template,
};
