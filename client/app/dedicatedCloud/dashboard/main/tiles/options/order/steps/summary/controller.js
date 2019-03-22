/* @ngInject */
export default class DedicatedCloudservicePackSmsActivation {
  constructor(
    $q,
    $state,
    ACTIVATION_STATUS,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.ACTIVATION_STATUS = ACTIVATION_STATUS;
  }

  $onInit() {
    if (this.orderedServicePack == null) {
      return this.stepper.exit();
    }

    return this.ovhUserPref.assign('DEDICATED_CLOUD_SERVICE_PACK_ACTIVATION', {
      certification: {
        orderUrl: this.orderURL,
        status: this.ACTIVATION_STATUS.pendingActivation,
      },
    });
  }
}
