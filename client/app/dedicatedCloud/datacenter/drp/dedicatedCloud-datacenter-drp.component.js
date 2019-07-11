import template from './dedicatedCloud-datacenter-drp.html';
import controller from './dedicatedCloud-datacenter-drp.controller';

export default {
  template,
  controller,
  bindings: {
    currentDrp: '<',
    currentService: '<',
    currentUser: '<',
    datacenterHosts: '<',
    datacenterList: '<',
  },
};
