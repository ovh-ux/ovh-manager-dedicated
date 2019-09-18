export default class {
  /* @ngInject */
  constructor(
    OvhApiVrack,
  ) {
    this.Vrack = OvhApiVrack;
  }

  $onInit() {
    if (!this.interface) {
      this.goBack();
    }
  }

  attach() {
    return this.Vrack.attach({ uuid: this.interface.uuid });
  }
}
