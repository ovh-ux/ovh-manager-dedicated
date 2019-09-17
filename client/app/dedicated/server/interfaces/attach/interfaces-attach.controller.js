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
    return this.Vrack.attach({ uuid: this.interface.uuid });
  }

  cancel() {
    this.$state.go('^');
  }
}
