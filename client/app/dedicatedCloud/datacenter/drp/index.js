import dedicatedCloudDatacenterDrp from './dedicatedCloud-datacenter-drp.component';
import dedicatedCloudDatacenterDrpOvhFirstStep from './steps/ovh/first/dedicatedCloud-datacenter-drp-ovh-firstStep.component';
import dedicatedCloudDatacenterDrpOvhSecondStep from './steps/ovh/second/dedicatedCloud-datacenter-drp-ovh-secondStep.component';
import dedicatedCloudDatacenterDrpOvhFinalStep from './steps/ovh/final/dedicatedCloud-datacenter-drp-ovh-finalStep.component';

import DedicatedCloudDatacenterDrpCtrl from './dedicatedCloud-datacenter-drp.controller';
import DedicatedCloudDatacenterDrpFirstStepCtrl from './steps/common/first/dedicatedCloud-datacenter-drp-firstStep.controller';
import DedicatedCloudDatacenterDrpOvhSecondStepCtrl from './steps/ovh/second/dedicatedCloud-datacenter-drp-ovh-secondStep.controller';
import DedicatedCloudDatacenterDrpFinalStepCtrl from './steps/common/final/dedicatedCloud-datacenter-drp-finalStep.controller';
import DedicatedCloudDatacenterDrpFinalStepDeleteCtrl from './steps/common/final/delete/dedicatedCloud-datacenter-drp-finalStep-delete.controller';

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
  .controller('DedicatedCloudDatacenterDrpFirstStepCtrl', DedicatedCloudDatacenterDrpFirstStepCtrl)
  .controller('DedicatedCloudDatacenterDrpOvhSecondStepCtrl', DedicatedCloudDatacenterDrpOvhSecondStepCtrl)
  .controller('DedicatedCloudDatacenterDrpFinalStepCtrl', DedicatedCloudDatacenterDrpFinalStepCtrl)
  .controller('DedicatedCloudDatacenterDrpFinalStepDeleteCtrl', DedicatedCloudDatacenterDrpFinalStepDeleteCtrl)
  .component('dedicatedCloudDatacenterDrp', dedicatedCloudDatacenterDrp)
  .component('dedicatedCloudDatacenterDrpOvhFirstStep', dedicatedCloudDatacenterDrpOvhFirstStep)
  .component('dedicatedCloudDatacenterDrpOvhSecondStep', dedicatedCloudDatacenterDrpOvhSecondStep)
  .component('dedicatedCloudDatacenterDrpOvhFinalStep', dedicatedCloudDatacenterDrpOvhFinalStep)
  .service('DedicatedCloudDrp', DedicatedCloudDrp);
