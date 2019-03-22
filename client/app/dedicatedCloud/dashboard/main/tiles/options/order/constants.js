import { step as confirmation } from './steps/confirmation';
import { step as requiredConfiguration } from './steps/requiredConfiguration';
import { step as selection } from './steps/selection';
import { step as smsActivation } from './steps/smsActivation';
import { step as summary } from './steps/summary';

export const ACTIVATION_TYPES = {
  all: [
    confirmation,
    requiredConfiguration,
    selection,
    smsActivation,
    summary,
  ],
  basic: [
    selection,
    summary,
  ],
  certification: [
    selection,
    requiredConfiguration,
    smsActivation,
    confirmation,
    summary,
  ],
};

export const COMPONENT_NAME = 'dedicatedCloudServicePack';
export const CONSTANT_NAME = 'DEDICATED_CLOUD_SERVICE_PACK_ACTIVATION';
export const MODULE_NAME = 'dedicatedCloudDashboardTilesOptionsOrder';
export const SERVICE_NAME = 'orderService';
export const STATE_NAME = 'app.dedicatedClouds.servicePack';

export default {
  ACTIVATION_TYPES,
  COMPONENT_NAME,
  CONSTANT_NAME,
  MODULE_NAME,
  STATE_NAME,
};
