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
    return this.VirtualInterface.v6().update({
      serverName: this.serverName,
      uuid: this.interface.id,
    }, {
      mode: this.interface.type,
      name: this.interface.name,
    }).$promise.then(() => {
      this.VirtualInterface.v6().resetCache();
      this.goBack();
    });
  }
}
