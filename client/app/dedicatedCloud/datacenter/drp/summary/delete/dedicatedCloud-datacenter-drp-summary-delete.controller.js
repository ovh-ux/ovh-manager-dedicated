export default class {
  /* @ngInject */
  constructor($state, $timeout, $translate, Alerter, dedicatedCloudDrp) {
    this.$state = $state;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
  }

  confirm() {
    this.isDeleting = true;
    return this.dedicatedCloudDrp.disableDrp(this.drpInformations)
      .then(() => this.$state.go('app.dedicatedClouds', {}, { reload: true }).then(() => {
        this.$timeout(() => {
          this.Alerter.success(this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_delete_drp_success'), 'dedicatedCloud_alert');
        }, 5000);
      }))
      .catch(error => this.$state.go('app.dedicatedClouds').then(() => {
        this.$timeout(() => {
          this.Alerter.error(this.$translate.instant(`${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_delete_drp_error')} ${_.get(error, 'message', '')}`), 'dedicatedCloud_alert');
        }, 0);
      }));
  }
}
