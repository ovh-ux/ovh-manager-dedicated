import _ from 'lodash';

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

    return this.$state.go(
      'app.dedicatedClouds.servicePackBasicOptionActivation.confirmation',
      {
        currentService: this.currentService,
        servicePackToOrder: _.find(
          this.orderableServicePacks,
          { name: this.selectedServicePackName },
        ),
      },
    );
  }
}
