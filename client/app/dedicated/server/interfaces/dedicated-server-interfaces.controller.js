class DedicatedServerInterfacesCtrl {
  constructor($q, $stateParams, OvhApiDedicatedServer) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.NicService = OvhApiDedicatedServer.Nic().v6();
    this.VniService = OvhApiDedicatedServer.Vni().v6();
  }

  $onInit() {
    this.physicalInterfaces = [];
    this.virtualInterfaces = [];
    this.serverName = this.$stateParams.productId;

    this.NicService.query({ serverName: this.serverName }).$promise
      .then(macs => this.$q.all(
        macs.map(mac => this.NicService.get({ serverName: this.serverName, mac }).$promise),
      ))
      .then((nics) => {
        this.physicalInterfaces = nics;
        return this.$q.all(nics.map(mac => this.VniService.get({
          serverName: this.serverName,
          uuid: mac.virtualNetworkInterface,
        }).$promise));
      })
      .then((vnis) => {
        this.virtualInterfaces = vnis;
      });
  }
}

angular.module('App').controller('DedicatedServerInterfacesCtrl', DedicatedServerInterfacesCtrl);
