// import * as confirmation from './confirmation';
import { step as requiredConfiguration } from './requiredConfiguration';
import { step as selection } from './selection';
// import * as smsActivation from './smsActivation';
// import * as summary from './summary';

export const COMPONENT_NAME = 'dedicatedCloudCertificationActivation';
export const MODULE_NAME = 'dedicatedCloudCertificationActivation';

export const STEPS = [
  selection,
  requiredConfiguration,
  /* smsActivation,
  confirmation,
  summary, */
];

export default {
  COMPONENT_NAME,
  MODULE_NAME,
  STEPS,
};
