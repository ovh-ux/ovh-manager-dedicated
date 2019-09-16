import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor($location, $state) {
    this.$location = $location;
    this.$state = $state;
  }

  $onInit() {
    if (!_.isNumber(this.ola.configStep)) {
      this.ola.configStep = 0;
    }
  }

  getStepClassname(step) {
    return {
      'oui-progress-tracker__step_active': this.ola.configStep === step,
      'oui-progress-tracker__step_complete': this.ola.configStep > step,
    };
  }

  activateOla() {
    this.$state.go('app.dedicated.server.interfaces.ola-activation');
  }

  closeSteps() {
    // For mockup
    this.$state.go('app.dedicated.server.interfaces', {
      isOlaActivated: true,
      isOlaConfigured: true,
    });

    // Clear query parameters then reload current state
    // this.$location.url(this.$location.path());
    // this.$state.reload();
  }

  goToNextStep() {
    this.ola.configStep += 1;
  }

  goToConfiguration() {
    this.$state.go('app.dedicated.server.interfaces.ola-configuration');
  }
}
