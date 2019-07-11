import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    $stateParams,
    $translate,
    $uibModal,
    Alerter,
    coreConfig,
    dedicatedCloudDrp,
    DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
    DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
    DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.coreConfig = coreConfig;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
    this.DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
    this.DRP_VPN_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS;
  }

  $onInit() {
    this.allowDedicatedServerComplianceOptions = this.coreConfig.getRegion() !== 'US';

    this.setAction = (action, data) => this.$scope.$parent.setAction(action, data);
    this.getDrpStatus();
  }

  getDrpStatus() {
    this.drpStatus = this.currentDrp.state;
    this.drpRemotePccStatus = this.currentDrp.drpType === this.DRP_OPTIONS.ovh
      ? this.dedicatedCloudDrp.constructor.formatStatus(_.get(this.currentDrp, 'remoteSiteInformation.state'))
      : this.DRP_STATUS.delivered;
  }

  openModalToEditDescription() {
    return this.$uibModal
      .open({
        animation: true,
        templateUrl: 'components/name-edition/name-edition.html',
        controller: 'NameEditionCtrl',
        controllerAs: '$ctrl',
        resolve: {
          data: () => ({
            contextTitle: 'dedicatedCloud_description',
            productId: this.$stateParams.productId,
            successText: this.$translate.instant('dedicatedCloud_dashboard_nameModifying_success'),
            value: this.currentService.description,
          }),
        },
      }).result;
  }

  buildDescription() {
    const productName = this.$translate.instant(`dedicatedCloud_type_${this.currentService.solution}`);
    const versionDisplayValue = this.currentService.solution === 'VSPHERE' && this.currentService.version
      ? ` ${this.currentService.version.major}`
      : '';

    return `${productName}${versionDisplayValue}`;
  }

  getUserAccessPolicyLabel() {
    const policy = this.currentService.userAccessPolicy;
    const formattedPolicy = _.snakeCase(policy).toUpperCase();

    return _.isString(formattedPolicy) && !_.isEmpty(formattedPolicy)
      ? this.$translate.instant(`dedicatedCloud_user_access_policy_${formattedPolicy}`)
      : '-';
  }

  isDrpActionPossible() {
    return [
      this.DRP_STATUS.delivered,
      this.DRP_STATUS.disabled,
      this.DRP_STATUS.waitingConfiguration,
    ].includes(this.drpStatus);
  }

  goToVpnConfigurationState() {
    return this.$state.go('app.dedicatedClouds.datacenter', {
      datacenterId: this.currentDrp.datacenterId,
    }).then(() => this.$state.go('app.dedicatedClouds.datacenter.drp.summary', {
      drpInformations: this.currentDrp,
    }));
  }

  deleteDrp() {
    return this.$uibModal.open({
      templateUrl: '/client/app/dedicatedCloud/dedicatedCloud-datacenter-drp-delete.html',
      controller: 'DedicatedCloudDatacenterDrpDeleteCtrl',
      controllerAs: '$ctrl',
      resolve: {
        drpInformations: () => this.dedicatedCloudDrp.constructor
          .getPlanServiceInformations(this.currentDrp),
      },
    }).result
      .then(() => {
        this.Alerter.success(this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_delete_drp_success'), 'dedicatedCloud_alert');
        return this.$state.go('app.dedicatedClouds.datacenter');
      })
      .catch((error) => {
        if (error != null) {
          this.Alerter.error(this.$translate.instant(`${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_delete_drp_error')} ${_.get(error, 'message', '')}`), 'dedicatedCloud_alert');
        }
      });
  }
}
