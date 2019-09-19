export default class {
  /* @ngInject */
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
    return this.VirtualInterface.v6().update({
      serverName: this.serverName,
      uuid: this.interface.id,
    }, {
      mode: this.interface.type,
      name: this.interface.name,
    });
  }

  cancel() {
    this.$state.go('^');
  }
}
