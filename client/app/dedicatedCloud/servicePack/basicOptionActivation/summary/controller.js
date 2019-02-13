/* @ngInject */
export default class DedicatedCloudServicePackBasicOptionActivationSummary {
  constructor(
    $state,
    ovhUserPref,
  ) {
    this.$state = $state;
    this.ovhUserPref = ovhUserPref;
  }

  $onInit() {
    if (this.orderedServicePack == null) {
      return this.$state.go('app.dedicatedClouds.servicePackBasicOptionActivation.confirmation');
    }

    if (this.orderURL == null) {
      return this.$state.go('app.dedicatedClouds.servicePackBasicOptionActivation.confirmation');
    }

    return this.$q.when();
  }
}
