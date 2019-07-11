export default class {
  /* @ngInject */
  constructor(
    $q,
    $state,
    dedicatedCloudDrp,
    DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
    DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
    this.DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
  }

  $onInit() {
    if (!this.currentDrp.isSuccessAlertDisable) {
      return this.dedicatedCloudDrp.setDisableSuccessAlertPreference(this.currentDrp.serviceName);
    }

    return this.$q.when(null);
  }

  isOnSummaryState() {
    if (this.currentState !== undefined) {
      return this.currentState === 'app.dedicatedClouds.datacenter.drp.summary';
    }

    return false;
  }

  goToVpnConfigurationState() {
    return this.$state
      .go(
        'app.dedicatedClouds.datacenter.drp.summary',
        { datacenterId: this.currentDrp.datacenterId, drpInformations: this.currentDrp },
      );
  }
}
