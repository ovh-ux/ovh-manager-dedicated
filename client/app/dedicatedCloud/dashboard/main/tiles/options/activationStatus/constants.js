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

export const COMPONENT_NAME = 'activationStatus';

export default {
  ACTIVATION_STATUS,
  COMPONENT_NAME,
};
