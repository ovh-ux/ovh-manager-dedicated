/* @ngInject */
export default class DedicatedCloudServicePackBasicOptionActivationSelection {
  constructor(
    $state,
  ) {
    this.$state = $state;
  }

  goToNextStep() {
    if (this.form.$invalid) {
      return null;
    }

    return this.$state.go('app.dedicatedClouds.servicePackBasicOptionActivation.confirmation');
  }
}
