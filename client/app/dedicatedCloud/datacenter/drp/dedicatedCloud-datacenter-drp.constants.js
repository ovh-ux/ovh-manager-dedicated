angular.module('App')
  .constant('DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS', {
    ovh: 'ovh',
    onPremise: 'onPremise',
  })
  .constant('DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS', [
    'broadcast', 'gateway', 'hsrp',
  ])
  .constant('DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP',
    new RegExp('/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/'))
  .constant('DEDICATEDCLOUD_DATACENTER_DRP_STATUS', {
    deliveredOrProvisionning: ['delivered', 'toProvision', 'provisionning'],
    toUnprovisionOrUnprovisionning: ['toUnprovision', 'unprovisionning'],
    disabled: 'disabled',
    delivered: 'delivered',
    toProvisionOrProvisionning: ['toProvision', 'provisionning'],
  });
