import _ from 'lodash';

/* @ngInject */
export default class DedicatedCloudServicePackCertificationActivationSmsActivation {
  constructor(
    $q,
    $state,
  ) {
    this.$q = $q;
    this.$state = $state;
  }

  $onInit() {
    if (this.orderedServicePack == null) {
      return this.$state.go('app.dedicatedClouds.servicePackCertificationActivation.confirmation');
    }

    if (_.isString(this.orderURL) && !_.isEmpty(this.orderURL)) {
      return this.ovhUserPref.assign('DEDICATED_CLOUD_SERVICE_PACK_BASIC_OPTION_ACTIVATION', {
        url: this.orderURL,
        status: this.DEDICATED_CLOUD_ACTIVATION_STATUS.pendingActivation,
      });
    }

    return this.$q.when();
  }
}
