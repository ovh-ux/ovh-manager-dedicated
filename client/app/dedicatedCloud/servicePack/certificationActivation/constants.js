import { step as confirmation } from './confirmation';
import { step as requiredConfiguration } from './requiredConfiguration';
import { step as selection } from './selection';
import { step as smsActivation } from './smsActivation';
import { step as summary } from './summary';

export const COMPONENT_NAME = 'dedicatedCloudCertificationActivation';
export const MODULE_NAME = 'dedicatedCloudCertificationActivation';
export const SERVICE_NAME = 'dedicatedCloudCertificationActivationService';
export const STATE_NAME = 'app.dedicatedClouds.certificationActivation';

export const STEPS = [
  selection,
  requiredConfiguration,
  smsActivation,
  confirmation,
  summary,
];

export default {
  COMPONENT_NAME,
  MODULE_NAME,
  SERVICE_NAME,
  STATE_NAME,
  STEPS,
};
