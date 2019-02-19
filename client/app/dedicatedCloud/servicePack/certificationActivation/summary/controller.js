/* @ngInject */
export default class DedicatedCloudServicePackCertificationActivationSmsActivation {
  constructor(
    $q,
    $state,
    DEDICATED_CLOUD_ACTIVATION_STATUS,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.DEDICATED_CLOUD_ACTIVATION_STATUS = DEDICATED_CLOUD_ACTIVATION_STATUS;
  }

  $onInit() {
    if (this.orderedServicePack == null) {
      return this.stepper.exit();
    }

    return this.ovhUserPref.assign('DEDICATED_CLOUD_SERVICE_PACK_ACTIVATION', {
      certification: {
        orderUrl: this.orderURL,
        status: this.DEDICATED_CLOUD_ACTIVATION_STATUS.pendingActivation,
      },
    });
  }
}
