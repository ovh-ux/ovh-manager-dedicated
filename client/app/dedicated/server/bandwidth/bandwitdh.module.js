import publicOrder from './public-order/public-order.component';
import publicCancel from './public-cancel/public-cancel.component';
import privateOrder from './private-order/private-order.component';
import privateCancel from './private-cancel/private-cancel.component';

import publicOrderRouting from './public-order/public-order.routing';
import publicCancelRouting from './public-cancel/public-cancel.routing';
import privateOrderRouting from './private-order/private-order.routing';
import privateCancelRouting from './private-cancel/private-cancel.routing';

angular
  .module('App')
  .component('dedicatedServerPublicBandwidthOrder', publicOrder)
  .component('dedicatedServerPublicBandwidthCancel', publicCancel)
  .component('dedicatedServerPrivateBandwidthOrder', privateOrder)
  .component('dedicatedServerPrivateBandwidthCancel', privateCancel)
  .config(publicOrderRouting)
  .config(publicCancelRouting)
  .config(privateOrderRouting)
  .config(privateCancelRouting);
