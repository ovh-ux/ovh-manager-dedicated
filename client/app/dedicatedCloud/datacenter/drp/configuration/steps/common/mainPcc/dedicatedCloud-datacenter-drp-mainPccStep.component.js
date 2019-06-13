import template from './dedicatedCloud-datacenter-drp-mainPccStep.html';
import controller from './dedicatedCloud-datacenter-drp-mainPccStep.controller';

export default {
  template,
  controller,
  bindings: {
    datacenters: '<datacenterList',
  },
};
