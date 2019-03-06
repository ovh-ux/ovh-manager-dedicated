import { step as confirmation } from '../confirmation';
import { step as requiredConfiguration } from '../requiredConfiguration';
import { step as selection } from '../selection';
import { step as smsActivation } from '../smsActivation';
import { step as summary } from '../summary';

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

export const COMPONENT_NAME = 'dedicatedCloudServicePackHome';
export const CONSTANT_NAME = 'DEDICATED_CLOUD_SERVICE_PACK_ACTIVATION';
export const MODULE_NAME = 'dedicatedCloudServicePackHome';
export const STATE_NAME = 'app.dedicatedClouds.servicePack';

export default {
  ACTIVATION_TYPES,
  COMPONENT_NAME,
  CONSTANT_NAME,
  MODULE_NAME,
  STATE_NAME,
};
