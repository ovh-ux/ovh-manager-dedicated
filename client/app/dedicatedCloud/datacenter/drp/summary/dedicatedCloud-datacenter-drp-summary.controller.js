export default class {
  /* @ngInject */
  constructor(
    $state, $timeout, $translate,
    Alerter, dedicatedCloudDrp, OvhApiMe, Validator,
    DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS, DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
    DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
  ) {
    this.$state = $state;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.OvhApiMe = OvhApiMe;
    this.Validator = Validator;
    this.DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
    this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
    this.VPN_CONFIGURATION_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS;
  }

  $onInit() {
    this.drpInformations = this.$state.params.drpInformations;
    this.drpStatus = this.dedicatedCloudDrp.constructor.formatStatus(this.currentDrp.state);

    this.email = this.currentUser.email;
    this.deleteActionAvailable = this.drpInformations
      .drpType === this.DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise
      ? true
      : this.dedicatedCloudDrp.constructor.formatStatus(_.get(this.currentDrp, 'remoteSiteInformation.state')) === this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered;

    this.ipValidator = (() => ({
      test: ip => this.Validator.isValidIpv4(ip),
    }))();
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

  isDrpTypeOnPremise() {
    return this.drpInformations.drpType === this.DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise;
  }

  canSetVpnConfiguration() {
    return this.isDrpTypeOnPremise()
      && this.drpInformations.state === this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered
      && this.drpInformations.vpnConfiguration.vpnConfigState
        !== this.VPN_CONFIGURATION_STATUS.configuring;
  }

  hasNoVpnConfiguration() {
    return this.drpInformations.vpnConfiguration
      .vpnConfigState === this.VPN_CONFIGURATION_STATUS.notConfigured;
  }

  validateVpnConfiguration() {
    this.isValidatingVpnConfiguration = true;
    return this.dedicatedCloudDrp.configureVpn(this.drpInformations)
      .then(() => this.$state.go('app.dedicatedClouds')
        .then(() => {
          this.Alerter.success(this.$translate.instant('dedicatedCloud_datacenter_drp_vpn_success', 'dedicatedCloudDatacenterDrpAlert'));
        }))
      .catch(() => {
        this.Alerter.error(this.$translate.instant('dedicatedCloud_datacenter_drp_vpn_error', 'dedicatedCloudDatacenterDrpAlert'));
      })
      .finally(() => {
        this.isValidatingVpnConfiguration = true;
      });
  }
}
