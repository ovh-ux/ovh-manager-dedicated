class DedicatedServerInterfacesCtrl {
  constructor($q, $stateParams, OvhApiDedicatedServer) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.NicService = OvhApiDedicatedServer.Nic().v6();
    this.VniService = OvhApiDedicatedServer.Vni().v6();
  }

  $onInit() {
    this.interfaces = [];
    this.physicalInterfaces = [];
    this.virtualInterfaces = [];
    this.serverName = this.$stateParams.productId;

    this.fetchInterfaces();
  }

  fetchInterfaces() {
    return this.NicService.query({ serverName: this.serverName }).$promise
      .then(macs => this.$q.all(
        macs.map(mac => this.NicService.get({ serverName: this.serverName, mac }).$promise),
      ))
      .then((nics) => {
        this.physicalInterfaces = nics;
        return this.$q.all(nics
          .filter(nic => !!nic.virtualNetworkInterface)
          .map(nic => this.VniService.get({
            serverName: this.serverName,
            uuid: nic.virtualNetworkInterface,
          }).$promise));
      })
      .then((vnis) => {
        this.virtualInterfaces = vnis;
        this.interfaces = this.constructor.mergeInterfaces(
          this.physicalInterfaces,
          this.virtualInterfaces,
        );
      });
  }

  static mergeInterfaces(physicals, virtuals) {
    return physicals
      .filter(physical => !virtuals.some(
        virtual => virtual.networkInterfaceController.includes(physical.mac),
      ))
      .map(physical => ({
        name: physical.mac,
        mac: physical.mac,
        type: physical.linkType,
        vrack: null,
      }))
      .concat(virtuals.map(virtual => ({
        name: virtual.name,
        mac: virtual.networkInterfaceController.join(', '),
        type: virtual.mode,
        vrack: virtual.vrack || '-',
      })));
  }
}

angular.module('App').controller('DedicatedServerInterfacesCtrl', DedicatedServerInterfacesCtrl);
