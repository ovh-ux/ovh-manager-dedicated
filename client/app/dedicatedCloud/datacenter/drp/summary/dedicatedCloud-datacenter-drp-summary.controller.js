export default class {
  /* @ngInject */
  constructor(
    $state, $stateParams, $timeout, $translate, $uibModal,
    Alerter, dedicatedCloudDrp, OvhApiMe,
    DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.OvhApiMe = OvhApiMe;
    this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
  }

  $onInit() {
    this.drpInformations = this.$stateParams.drpInformations;
    this.drpStatus = this.dedicatedCloudDrp.constructor.formatStatus(this.currentDrp.state);

    this.email = this.currentUser.email;
    this.deleteActionAvailable = this.dedicatedCloudDrp.constructor.formatStatus(_.get(this.currentDrp, 'remoteSiteInformation.state')) === this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered;
  }

  regenerateZsspPassword() {
    this.generatingPassword = true;
    return this.dedicatedCloudDrp.regenerateZsspPassword(this.drpInformations)
      .then(() => {
        this.Alerter.success(`
          ${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_create_success_part_two', { email: this.email })}
        `, 'dedicatedCloudDatacenterDrpAlert');
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_zssp_password_regenerate_error')} ${_.get(error, 'message', '')}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.generatingPassword = false;
      });
  }

  deleteDrpModal() {
    this.$uibModal.open({
      templateUrl: '/client/app/dedicatedCloud/dedicatedCloud-datacenter-drp-delete.html',
      controller: 'DedicatedCloudDatacenterDrpDeleteCtrl',
      controllerAs: '$ctrl',
      resolve: {
        drpInformations: () => this.drpInformations,
      },
    }).result
      .then(() => {
        this.Alerter.success(this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_delete_drp_success'), 'dedicatedCloudDatacenterAlert');
        return this.$state.go('app.dedicatedClouds.datacenter');
      })
      .catch((error) => {
        if (error != null) {
          this.Alerter.error(this.$translate.instant(`${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_delete_drp_error')} ${_.get(error, 'message', '')}`), 'dedicatedCloudDatacenterDrpAlert');
        }
      });
  }

  isProvisionning() {
    return [
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toProvision,
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.provisionning,
    ].includes(this.currentDrp.state);
  }
}
