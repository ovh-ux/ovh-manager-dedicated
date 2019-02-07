/* @ngInject */
export default class DedicatedCloudServicePackCertificationActivationSMSActivation {
  constructor(
    $q,
    $state,
  ) {
    this.$q = $q;
    this.$state = $state;
  }

  $onInit() {
    this.userAccessPolicyIsCorrect = this.currentService.userAccessPolicy === 'filtered';
    this.numberOfAllowedIPsAndBlocksIsAllowed = this.allowedIPsAndBlocks.count > 1;
    this.configurationIsCorrect = this.userAccessPolicyIsCorrect
      || this.numberOfAllowedIPsAndBlocksIsAllowed;
  }

  mapAllowedIPsAndBlocks() {
    const data = this.allowedIPsAndBlocks.list.results;

    return this.$q.when({
      data,
      meta: {
        totalCount: data.length,
      },
    });
  }

  goToNextStep() {
    if (this.form.$invalid) {
      return null;
    }

    return this.$state.go('app.dedicatedClouds.servicePackCertificationActivation.requiredConfiguration');
  }
}
