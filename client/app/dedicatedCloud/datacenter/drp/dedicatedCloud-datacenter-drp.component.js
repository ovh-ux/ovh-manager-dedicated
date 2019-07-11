import template from './dedicatedCloud-datacenter-drp.html';
import controller from './dedicatedCloud-datacenter-drp.controller';

export default {
  template,
  controller,
  bindings: {
    currentDrp: '<',
    currentUser: '<',
    datacenterHosts: '<',
    datacenterList: '<',
    pccList: '<',
  },
};
