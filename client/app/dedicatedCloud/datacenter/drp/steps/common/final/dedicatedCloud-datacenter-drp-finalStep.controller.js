angular.module('App').controller('DedicatedCloudDatacenterDrpFinalStepCtrl', class DedicatedCloudDatacenterDrpFinalStepCtrl {
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
    this.loading = true;
    this.drpInformations = this.$stateParams.drpInformations;
    const { state } = this.drpInformations;
    const otherPccInformations = this.getOtherPccInformations();

    return this.$q.all({
      enableDrp: this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.deliveredOrProvisionning.includes(state)
        ? this.$q.when({})
        : this.DedicatedCloudDrp.enableDrp(this.drpInformations),
      me: this.OvhApiMe.v6().get().$promise,
      secondaryPccState: _.isNull(otherPccInformations.serviceName)
        ? this.$q.when({})
        : this.DedicatedCloudDrp.getDrpState(otherPccInformations),
    })
      .then(({ enableDrp, me, secondaryPccState }) => {
        if (enableDrp.state === 'todo') {
          this.isEnabling = true;
        }
        this.email = me.email;

        this.deleteActionAvailable = secondaryPccState
          .state === this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered;
        if (state === this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered) {
          this.Alerter.success(`
            <p>${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_create_success_part_one')}</p>
            <strong>${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_create_success_part_two', { email: this.email })}</strong>
          `, 'dedicatedCloudDatacenterDrpAlert');
        }
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_create_error')} ${_.get(error, 'message', '')}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getOtherPccInformations() {
    const primaryOptions = {
      serviceName: _.get(this.drpInformations, 'primaryPcc.serviceName', null),
      datacenterId: _.get(this.drpInformations, 'primaryDatacenter.id', null),
    };

    const secondaryOptions = {
      serviceName: _.get(this.drpInformations, 'secondaryPcc.serviceName', null),
      datacenterId: _.get(this.drpInformations, 'secondaryDatacenter.id', null),
    };

    return [primaryOptions, secondaryOptions]
      .find(({ serviceName }) => serviceName !== this.$stateParams.productId);
  }

  regenerateZsspPassword() {
    this.generatingPassword = true;
    return this.DedicatedCloudDrp.regenerateZsspPassword(this.drpInformations)
      .then(() => {
        this.Alerter.success(`
          <p>${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_create_success_part_one')}</p>
          <strong>${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_create_success_part_two', { email: this.email })}</strong>
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
      templateUrl: 'dedicatedCloud/datacenter/drp/steps/common/final/delete/dedicatedCloud-datacenter-drp-finalStep-delete.html',
      controller: 'DedicatedCloudDatacenterDrpFinalStepDeleteCtrl',
      controllerAs: '$ctrl',
    }).result
      .then(() => this.DedicatedCloudDrp.disableDrp(this.drpInformations))
      .then(() => {
        this.Alerter.success(this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_delete_drp_success'), 'dedicatedCloudDatacenterDrpAlert');
        this.$state.go('app.dedicatedClouds.datacenter');
      })
      .catch((error) => {
        this.Alerter.error(this.$translate.instant(`${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_delete_drp_error')} ${_.get(error, 'message', '')}`), 'dedicatedCloudDatacenterDrpAlert');
      });
  }

  isProvisionning() {
    return this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toProvisionOrProvisionning
      .includes(this.drpInformations.state);
  }
});
