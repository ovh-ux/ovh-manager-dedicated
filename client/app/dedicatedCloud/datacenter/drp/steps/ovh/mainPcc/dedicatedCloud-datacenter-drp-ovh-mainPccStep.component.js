import template from '../../common/mainPcc/dedicatedCloud-datacenter-drp-mainPccStep.html';
import DedicatedCloudDatacenterDrpMainPccStepCtrl from '../../common/mainPcc/dedicatedCloud-datacenter-drp-mainPccStep.controller';

export default {
  template,
  controller: DedicatedCloudDatacenterDrpMainPccStepCtrl,
  bindings: {
    datacenters: '<datacenterList',
  },
};
