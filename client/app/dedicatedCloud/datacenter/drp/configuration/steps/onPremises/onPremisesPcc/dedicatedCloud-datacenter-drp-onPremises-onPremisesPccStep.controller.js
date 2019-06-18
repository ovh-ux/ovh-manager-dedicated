export default class {
  /* @ngInject */
  constructor(
    $state, $timeout, $translate, $window,
    Alerter, dedicatedCloudDrp, ovhUserPref,
    DEDICATED_CLOUD_CONSTANTS,
    DEDICATEDCLOUD_DATACENTER_DRP_IP_BLOCK_REG_EXP,
    DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
    DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS,
    DEDICATEDCLOUD_DATACENTER_ZERTO,
  ) {
    this.$state = $state;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.ovhUserPref = ovhUserPref;
    this.IP_BLOCK_REG_EXP = DEDICATEDCLOUD_DATACENTER_DRP_IP_BLOCK_REG_EXP;
    this.PCC_NEW_GENERATION = DEDICATED_CLOUD_CONSTANTS.pccNewGeneration;
    this.DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
    this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS;
    this.DEDICATEDCLOUD_DATACENTER_ZERTO = DEDICATEDCLOUD_DATACENTER_ZERTO;
  }

  $onInit() {
    this.drpInformations = this.$state.params.drpInformations;
  }

  validateConfiguration() {
    this.isValidating = true;

    return this.dedicatedCloudDrp.enableDrp(
      this.drpInformations,
      this.drpInformations.primaryPcc.generation !== this.PCC_NEW_GENERATION,
    )
      .then((enableDrp) => {
        if (enableDrp.url !== undefined) {
          this.storeZertoOptionOrderInUserPref(this.drpInformations, enableDrp);
          if (!enableDrp.hasAutoPay) {
            this.$window.open(enableDrp.url, '_blank');
          }
        }

        return this.$state.go('app.dedicatedClouds', { reload: true }).then(() => {
          // $timeout necessary to display alerter message
          this.$timeout(() => {
            this.Alerter.set(
              'alert-info',
              `
              ${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_creation_pending')} ${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_creation_pending_task')}
            `,
              null,
              'dedicatedCloud_alert',
            );
          }, 0);
        });
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_create_error')} ${_.get(error, 'data.message', error.message)}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.isValidating = false;
      });
  }

  storeZertoOptionOrderInUserPref(drpInformations, enableDrp) {
    const drpInformationsToStore = {
      drpInformations,
      zertoOptionOrderId: enableDrp.orderId,
      zertoOption: drpInformations.drpType === this.DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh
        ? this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.ovh
        : this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.onPremises,
    };

    const { splitter } = this.DEDICATEDCLOUD_DATACENTER_ZERTO;
    const [, ...[formattedServiceName]] = drpInformations.primaryPcc.serviceName.split(splitter);
    const preferenceKey = `${this.DEDICATEDCLOUD_DATACENTER_ZERTO.title}_${formattedServiceName.replace(/-/g, '')}`;

    return this.ovhUserPref.create(preferenceKey, drpInformationsToStore);
  }

  goToPreviousStep() {
    return this.$state.go('app.dedicatedClouds.datacenter.drp.onPremises.ovhPccStep', {
      drpInformations: this.drpInformations,
    });
  }
}