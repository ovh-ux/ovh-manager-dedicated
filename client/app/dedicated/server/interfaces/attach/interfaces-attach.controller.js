export default class {
  constructor(
    $state,
    $stateParams,
    OvhApiVrack,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.Vrack = OvhApiVrack;
  }

  $onInit() {
    this.interface = this.$stateParams.interface;
    if (!this.interface) {
      this.$state.go('^');
    }
  }

  attach() {
    return this.Vrack.DedicatedServerInterface().v6().post({
      serviceName: this.vrack,
    }, {
      dedicatedServerInterface: this.interface.id,
    }).$promise.then(() => {
      this.$state.go('^');
    });
  }

  cancel() {
    this.$state.go('^');
  }
}
