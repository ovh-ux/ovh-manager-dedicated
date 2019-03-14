export const COMPONENT_NAME = 'activationStatus';
export const CONSTANT_NAME = 'ACTIVATION_STATUS';
export const MODULE_NAME = 'activationStatus';

export const ACTIVATION_STATUS = {
  beingActivated: {
    name: 'beingActivated',
    type: 'warning',
  },
  disabled: {
    name: 'disabled',
    type: 'error',
  },
  enabled: {
    name: 'enabled',
    type: 'success',
  },
  pendingActivation: {
    name: 'pendingActivation',
    type: 'error',
  },
  unknown: {
    name: 'unknown',
    type: 'info',
  },
};

export default {
  COMPONENT_NAME,
  CONSTANT_NAME,
  MODULE_NAME,
  ACTIVATION_STATUS,
};
