/* @ngInject */
export default class DedicatedCloudServicePackCertificationActivationSelection {
  constructor(
    $state,
  ) {
    this.$state = $state;
  }

  goToNextStep() {
    if (this.form.$invalid) {
      return null;
    }

    return this.stepper.goToNextStep();
  }
}
