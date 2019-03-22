import { step as requiredConfiguration } from './steps/requiredConfiguration';
import { step as selection } from './steps/selection';
import { step as smsActivation } from './steps/smsActivation';
import { step as summary } from './steps/summary';

export const ACTIVATION_TYPES = {
  basic: [
    selection,
  ],
  certification: [
    selection,
    requiredConfiguration,
    smsActivation,
    summary,
  ],
};

ACTIVATION_TYPES.all = _.uniq(
  _.flatten(
    _.values(ACTIVATION_TYPES),
  ).map(step => step.moduleName),
);

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
