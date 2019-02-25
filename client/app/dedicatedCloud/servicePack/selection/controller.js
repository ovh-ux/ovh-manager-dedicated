/* @ngInject */
export default class {
  constructor(
    $state,
  ) {
    this.$state = $state;
  }

  $onInit() {
    this.a = 'p';
  }

  goToNextStep() {
    if (this.form.$invalid) {
      return null;
    }

    return this.stepper.goToNextStep({ servicePackToOrder: this.servicePackToOrder });
  }
}
