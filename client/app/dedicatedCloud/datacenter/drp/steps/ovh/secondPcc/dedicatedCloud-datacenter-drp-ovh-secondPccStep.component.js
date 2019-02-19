import template from './dedicatedCloud-datacenter-drp-ovh-secondPccStep.html';
import DedicatedCloudDatacenterDrpOvhSecondPccStepCtrl from './dedicatedCloud-datacenter-drp-ovh-secondPccStep.controller';

export default {
  template,
  controller: DedicatedCloudDatacenterDrpOvhSecondPccStepCtrl,
  bindings: {
    pccList: '<',
  },
};
