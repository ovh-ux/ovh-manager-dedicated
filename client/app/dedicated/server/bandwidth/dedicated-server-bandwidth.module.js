import publicBandwidthOrderComponent from './order-public/dedicated-server-bandwidth-order.component';
import publicBandwidthCancelComponent from './cancel-public/dedicated-server-bandwidth-cancel.component';
import privateBandwidthOrderComponent from './order-private/dedicated-server-bandwidth-vrack.component';
import privateBandwidthCancelComponent from './cancel-private/dedicated-server-bandwidth-vrack-cancel.component';

import routing from './dedicated-server-bandwitdh.routing';

angular
  .module('App')
  .config(routing)
  .component('dedicatedServerPublicBandwidthOrder', publicBandwidthOrderComponent)
  .component('dedicatedServerPublicBandwidthCancel', publicBandwidthCancelComponent)
  .component('dedicatedServerPrivateBandwidthOrder', privateBandwidthOrderComponent)
  .component('dedicatedServerPrivateBandwidthCancel', privateBandwidthCancelComponent);
