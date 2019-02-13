import template from './dedicatedCloud-datacenter-drp.html';
import DedicatedCloudDatacenterDrpCtrl from './dedicatedCloud-datacenter-drp.controller';

export default {
  template,
  controller: DedicatedCloudDatacenterDrpCtrl,
  bindings: {
    datacenterHosts: '<',
    datacenterList: '<',
    pccList: '<',
    pccPlan: '<',
  },
};
