import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor($location, $state) {
    this.$location = $location;
    this.$state = $state;
  }

  $onInit() {
    if (!_.isNumber(this.currentStep)) {
      this.currentStep = 0;
    }
  }

  getStepClassname(step) {
    return {
      'oui-progress-tracker__step_active': this.currentStep === step,
      'oui-progress-tracker__step_complete': this.currentStep > step,
    };
  }

  activateOla() {
    this.$state.go('app.dedicated.server.interfaces.ola-activation');
  }

  closeSteps() {
    // Clear query parameters then reload current state
    this.$location.url(this.$location.path());
    this.$state.reload();
  }

  goToNextStep() {
    this.currentStep += 1;
  }

  goToConfiguration() {
    this.$state.go('app.dedicated.server.interfaces.ola-configuration');
  }
}
