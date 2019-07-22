import controller from './billing-autoRenew-delete.controller';
import template from './billing-autoRenew-delete.html';

export default {
  bindings: {
    engagement: '<',
    goBack: '<',
    service: '<',
    updateService: '<',
  },
  controller,
  template,
};
