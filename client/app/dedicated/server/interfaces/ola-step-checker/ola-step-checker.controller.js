import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor($state) {
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
    // TODO: Modal for OLA activation
    this.$state.go('app.dedicated.server.interfaces', {
      showSteps: true,
    });
  }

  closeSteps() {
    // TODO
    console.log('closeSteps', this);
  }

  goToNextStep() {
    this.currentStep += 1;
  }

  goToConfiguration() {
    this.$state.go('app.dedicated.server.interfaces.ola');
  }
}
