import template from './delete/dedicatedCloud-datacenter-drp-finalStep-delete.html';

export default class {
  /* @ngInject */
  constructor(
    $q, $state, $stateParams, $translate, $uibModal,
    Alerter, DedicatedCloudDrp, OvhApiMe,
    DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.DedicatedCloudDrp = DedicatedCloudDrp;
    this.OvhApiMe = OvhApiMe;
    this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
  }

  $onInit() {
    this.isLoading = true;
    this.drpInformations = this.$stateParams.drpInformations;
    const { state } = this.drpInformations;
    const otherPccInformations = this.getOtherPccInformations();

    return this.$q.all({
      enableDrp: this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.deliveredOrProvisionning.includes(state)
        ? this.$q.when({})
        : this.DedicatedCloudDrp.enableDrp(this.drpInformations),
      me: this.OvhApiMe.v6().get().$promise,
      secondaryPccState: _.isUndefined(otherPccInformations.serviceName)
        ? this.$q.when({})
        : this.DedicatedCloudDrp.getDrpState(otherPccInformations),
    })
      .then(({ enableDrp, me, secondaryPccState }) => {
        if (enableDrp.state === this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toDo) {
          this.isEnabling = true;
        }
        this.email = me.email;

        this.deleteActionAvailable = secondaryPccState
          .state === this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered;
        if (state === this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered) {
          this.Alerter.success(`
            ${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_create_success_part_one')} ${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_create_success_part_two', { email: this.email })}
          `, 'dedicatedCloudDatacenterDrpAlert');
        }
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_create_error')} ${_.get(error, 'message', '')}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getOtherPccInformations() {
    const primaryOptions = {
      serviceName: _.get(this.drpInformations, 'primaryPcc.serviceName'),
      datacenterId: _.get(this.drpInformations, 'primaryDatacenter.id'),
    };

    const secondaryOptions = {
      serviceName: _.get(this.drpInformations, 'secondaryPcc.serviceName'),
      datacenterId: _.get(this.drpInformations, 'secondaryDatacenter.id'),
    };

    return [primaryOptions, secondaryOptions]
      .find(({ serviceName }) => serviceName !== this.$stateParams.productId);
  }

  regenerateZsspPassword() {
    this.generatingPassword = true;
    return this.DedicatedCloudDrp.regenerateZsspPassword(this.drpInformations)
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
      template,
      controller: 'DedicatedCloudDatacenterDrpFinalStepDeleteCtrl',
      controllerAs: '$ctrl',
    }).result
      .then(() => this.DedicatedCloudDrp.disableDrp(this.drpInformations))
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
    return this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toProvisionOrProvisionning
      .includes(this.drpInformations.state);
  }
}
