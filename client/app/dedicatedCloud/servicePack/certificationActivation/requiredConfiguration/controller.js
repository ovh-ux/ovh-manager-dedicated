/* @ngInject */
export default class DedicatedCloudServicePackCertificationActivationRequiredConfiguration {
  constructor(
    $q,
    $state,
  ) {
    this.$q = $q;
    this.$state = $state;
  }

  $onInit() {
    this.userAccessPolicyIsCorrect = this.currentService.userAccessPolicy === 'filtered';
    this.numberOfAllowedIPsAndBlocksIsAllowed = this.allowedIPsAndBlocks.length > 1;
    this.configurationIsCorrect = this.userAccessPolicyIsCorrect
      || this.numberOfAllowedIPsAndBlocksIsAllowed;
  }

  mapAllowedIPsAndBlocks() {
    return this.$q.when({
      data: this.allowedIPsAndBlocks,
      meta: {
        totalCount: this.allowedIPsAndBlocks.length,
      },
    });
  }
}
