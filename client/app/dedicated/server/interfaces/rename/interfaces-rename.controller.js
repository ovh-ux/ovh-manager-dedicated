export default class {
  /* @ngInject */
  constructor(
    OvhApiDedicatedServerVirtualInterface,
  ) {
    this.VirtualInterface = OvhApiDedicatedServerVirtualInterface;
  }

  $onInit() {
    if (!this.interface) {
      this.goBack();
    }
  }

  rename() {
    return this.VirtualInterface.update({
      serverName: this.serverName,
      uuid: this.interface.uuid,
      virtualNetworkInterface: this.interface,
    });
  }
}
