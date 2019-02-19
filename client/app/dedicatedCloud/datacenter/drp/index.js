import dedicatedCloudDatacenterDrp from './dedicatedCloud-datacenter-drp.component';
import dedicatedCloudDatacenterDrpOvhMainPccStep from './steps/ovh/mainPcc/dedicatedCloud-datacenter-drp-ovh-mainPccStep.component';
import dedicatedCloudDatacenterDrpOvhSecondPccStep from './steps/ovh/secondPcc/dedicatedCloud-datacenter-drp-ovh-secondPccStep.component';
import dedicatedCloudDatacenterDrpOvhConfirmationStep from './steps/ovh/confirmation/dedicatedCloud-datacenter-drp-ovh-confirmationStep.component';

import DedicatedCloudDatacenterDrpCtrl from './dedicatedCloud-datacenter-drp.controller';
import DedicatedCloudDatacenterDrpMainPccStepCtrl from './steps/common/mainPcc/dedicatedCloud-datacenter-drp-mainPccStep.controller';
import DedicatedCloudDatacenterDrpOvhSecondPccStepCtrl from './steps/ovh/secondPcc/dedicatedCloud-datacenter-drp-ovh-secondPccStep.controller';
import DedicatedCloudDatacenterDrpConfirmationStepCtrl from './steps/common/confirmation/dedicatedCloud-datacenter-drp-confirmationStep.controller';
import DedicatedCloudDatacenterDrpConfirmationStepDeleteCtrl from './steps/common/confirmation/delete/dedicatedCloud-datacenter-drp-confirmationStep-delete.controller';

import DedicatedCloudDrp from './dedicatedCloud-datacenter-drp.service';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP,
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ROLES,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
} from './dedicatedCloud-datacenter-drp.constants';

angular.module('App')
  .constant('DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP', DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP)
  .constant('DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS', DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS)
  .constant('DEDICATEDCLOUD_DATACENTER_DRP_ROLES', DEDICATEDCLOUD_DATACENTER_DRP_ROLES)
  .constant('DEDICATEDCLOUD_DATACENTER_DRP_STATUS', DEDICATEDCLOUD_DATACENTER_DRP_STATUS)
  .constant('DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS', DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS)
  .controller('DedicatedCloudDatacenterDrpCtrl', DedicatedCloudDatacenterDrpCtrl)
  .controller('DedicatedCloudDatacenterDrpMainPccStepCtrl', DedicatedCloudDatacenterDrpMainPccStepCtrl)
  .controller('DedicatedCloudDatacenterDrpOvhSecondPccStepCtrl', DedicatedCloudDatacenterDrpOvhSecondPccStepCtrl)
  .controller('DedicatedCloudDatacenterDrpConfirmationStepCtrl', DedicatedCloudDatacenterDrpConfirmationStepCtrl)
  .controller('DedicatedCloudDatacenterDrpConfirmationStepDeleteCtrl', DedicatedCloudDatacenterDrpConfirmationStepDeleteCtrl)
  .component('dedicatedCloudDatacenterDrp', dedicatedCloudDatacenterDrp)
  .component('dedicatedCloudDatacenterDrpOvhMainPccStep', dedicatedCloudDatacenterDrpOvhMainPccStep)
  .component('dedicatedCloudDatacenterDrpOvhSecondPccStep', dedicatedCloudDatacenterDrpOvhSecondPccStep)
  .component('dedicatedCloudDatacenterDrpOvhConfirmationStep', dedicatedCloudDatacenterDrpOvhConfirmationStep)
  .service('DedicatedCloudDrp', DedicatedCloudDrp);
