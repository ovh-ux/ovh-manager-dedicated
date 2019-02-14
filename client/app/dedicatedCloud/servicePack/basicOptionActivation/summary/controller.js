import _ from 'lodash';
/* @ngInject */
export default class DedicatedCloudServicePackBasicOptionActivationSummary {
  constructor(
    $state,
    ovhUserPref,
    DEDICATED_CLOUD_ACTIVATION_STATUS,
  ) {
    this.$state = $state;
    this.ovhUserPref = ovhUserPref;
    this.DEDICATED_CLOUD_ACTIVATION_STATUS = DEDICATED_CLOUD_ACTIVATION_STATUS;
  }

  $onInit() {
    if (this.orderedServicePack == null) {
      return this.$state.go('app.dedicatedClouds.servicePackBasicOptionActivation.confirmation');
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
