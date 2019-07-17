import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
} from '../dedicatedCloud-datacenter-drp.constants';

export default class {
  /* @ngInject */
  constructor(
    $state, $timeout, $translate,
    Alerter, dedicatedCloudDrp, OvhApiMe, Validator,
  ) {
    this.$state = $state;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.OvhApiMe = OvhApiMe;
    this.Validator = Validator;
  }

  $onInit() {
    this.drpInformations = this.$state.params.drpInformations;
    this.drpStatus = this.dedicatedCloudDrp.constructor.formatStatus(this.currentDrp.state);

    this.email = this.currentUser.email;
    this.deleteActionAvailable = this.drpInformations
      .drpType === DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise
      ? true
      : this.dedicatedCloudDrp.constructor.formatStatus(_.get(this.currentDrp, 'remoteSiteInformation.state')) === DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered;

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
    return this.$state.go('app.dedicatedClouds.datacenter.drp.summary.deleteDrp');
  }

  isProvisionning() {
    return [
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toProvision,
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.provisionning,
    ].includes(this.currentDrp.state);
  }

  isDrpTypeOnPremise() {
    return this.drpInformations.drpType === DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.onPremise;
  }

  canSetVpnConfiguration() {
    return this.isDrpTypeOnPremise()
      && this.drpInformations.state === DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered
      && this.drpInformations.vpnConfiguration.vpnConfigState
        !== DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS.configuring;
  }

  hasNoVpnConfiguration() {
    return this.drpInformations.vpnConfiguration
      .vpnConfigState === DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS.notConfigured;
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
