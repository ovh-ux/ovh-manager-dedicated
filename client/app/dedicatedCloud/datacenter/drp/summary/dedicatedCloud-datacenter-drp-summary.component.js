import template from './dedicatedCloud-datacenter-drp-summary.html';
import controller from './dedicatedCloud-datacenter-drp-summary.controller';

export default {
  template,
  controller,
  bindings: {
    currentDrp: '<',
    currentUser: '<',
  },
};
