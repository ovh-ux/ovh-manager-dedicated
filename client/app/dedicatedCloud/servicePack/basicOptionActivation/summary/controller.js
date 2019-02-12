/* @ngInject */
export default class DedicatedCloudServicePackBasicOptionActivationSummary {
  constructor(
    $state,
  ) {
    this.$state = $state;
  }

  $onInit() {
    if (this.orderedServicePack == null) {
      return this.$state.go('app.dedicatedClouds.servicePackBasicOptionActivation.confirmation');
    }

    return this.$q.when();
  }
}
