import template from './dedicatedCloud-datacenter-drp-alerts.html';
import controller from './dedicatedCloud-datacenter-drp-alerts.controller';

export default {
  template,
  controller,
  bindings: {
    currentDrp: '<',
    currentUser: '<',
    currentState: '<?',
  },
  name: 'ovhManagerDedicatedCloudDatacenterDrpAlerts',
};
