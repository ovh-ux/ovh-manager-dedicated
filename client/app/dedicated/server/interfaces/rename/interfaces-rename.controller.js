export default class {
  constructor(
    $state,
    $stateParams,
    OvhApiDedicatedServerVirtualInterface,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.VirtualInterface = OvhApiDedicatedServerVirtualInterface;
  }

  $onInit() {
    this.interface = this.$stateParams.interface;
    if (!this.interface) {
      this.$state.go('^');
    }
  }

  rename() {
    return this.VirtualInterface.update({
      serverName: this.serverName,
      uuid: this.interface.uuid,
      virtualNetworkInterface: this.interface,
    });
  }

  cancel() {
    this.$state.go('^');
  }
}
