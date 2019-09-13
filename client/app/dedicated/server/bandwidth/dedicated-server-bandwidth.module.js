import component from './order/dedicated-server-bandwidth-order.component';
import routing from './order/dedicated-server-bandwitdh-order.routing';

angular
  .module('App')
  .config(routing)
  .component('dedicatedServerBandwidthOrder', component);
