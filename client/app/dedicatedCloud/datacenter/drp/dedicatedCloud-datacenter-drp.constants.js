export const DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS = {
  ovh: 'ovh',
  onPremise: 'onPremise',
};

export const DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS = [
  'broadcast', 'gateway', 'hsrp',
];

export const DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP = new RegExp('/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/');

export const DEDICATEDCLOUD_DATACENTER_DRP_STATUS = {
  deliveredOrProvisionning: ['delivered', 'toProvision', 'provisionning'],
  toUnprovisionOrUnprovisionning: ['toUnprovision', 'unprovisionning'],
  disabling: 'disabling',
  delivered: 'delivered',
  toProvisionOrProvisionning: ['toProvision', 'provisionning'],
  toDo: 'todo',
};

export const DEDICATEDCLOUD_DATACENTER_DRP_ROLES = {
  primary: 'primary',
  secondary: 'secondary',
};

export default {
  DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP,
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ROLES,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
};