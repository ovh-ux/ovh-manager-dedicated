import template from '../../common/first/dedicatedCloud-datacenter-drp-firstStep.html';
import DedicatedCloudDatacenterDrpFirstStepCtrl from '../../common/first/dedicatedCloud-datacenter-drp-firstStep.controller';

export default {
  template,
  controller: DedicatedCloudDatacenterDrpFirstStepCtrl,
  bindings: {
    datacenters: '<datacenterList',
  },
};
