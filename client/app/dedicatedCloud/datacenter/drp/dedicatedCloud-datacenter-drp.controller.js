import {
  DEDICATEDCLOUD_DATACENTER_DRP_ROLES,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
} from './dedicatedCloud-datacenter-drp.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $transitions,
    $translate,
    Alerter,
    dedicatedCloudDrp,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$transitions = $transitions;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.DEDICATEDCLOUD_DATACENTER_DRP_ROLES = DEDICATEDCLOUD_DATACENTER_DRP_ROLES;
    this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
  }

  $onInit() {
    this.loading = true;
    this.selectedDrpType = { id: this.$stateParams.selectedDrpType };
    this.drpInformations = { };
    this.drpInformations.hasDatacenterWithoutHosts = this.datacenterHosts.length === 0;

    this.initializeTransitions();

    this.isDisablingDrp = [
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toDisable,
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabling,
    ].includes(this.currentDrp.state);

    return this.dedicatedCloudDrp.checkForZertoOptionOrder(this.$stateParams.productId)
      .then((storedDrpInformations) => {
        if (!this.isDisablingDrp) {
          const drp = this.isDeliveredOrDelivering(this.currentDrp.state) ? this.currentDrp : null;
          const otherDrpInformations = drp !== null
            ? this.formatPlanInformations(drp)
            : storedDrpInformations;

          if (otherDrpInformations != null) {
            this.drpInformations = {
              ...this.drpInformations,
              ...otherDrpInformations,
            };

            return this.$state.go('app.dedicatedClouds.datacenter.drp.summary', {
              drpInformations: this.drpInformations,
            });
          }
        }

        return this.$q.when();
      })
      .catch((error) => {
        this.Alerter.error(
          `${this.$translate.instant('dedicatedCloud_datacenter_drp_get_state_error')} ${_.get(error, 'data.message', error.message)}`,
          'dedicatedCloudDatacenterAlert',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  initializeTransitions() {
    this.$transitions.onError({
      from: 'app.dedicatedClouds.datacenter.drp.**.orderIp',
    }, () => {
      this.Alerter.error(this.$translate.instant('ip_order_finish_error'), 'dedicatedCloudDatacenterDrpAlert');
    });
  }

  selectDrpType() {
    this.drpInformations.drpType = this.selectedDrpType.id;
    return this.$state.go(`app.dedicatedClouds.datacenter.drp.${this.selectedDrpType.id}.mainPccStep`, {
      drpInformations: this.drpInformations,
    });
  }

  isDeliveredOrDelivering(state) {
    return [
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering,
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered,
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.provisionning,
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toProvision,
    ].includes(state);
  }

  formatPlanInformations({
    datacenterId, drpType, localSiteInformation, remoteSiteInformation, serviceName, state,
  }) {
    const currentPccInformations = _.find(this.pccList, { serviceName });
    const currentDatacenterInformations = this.datacenterList.find(({ id }) => id === datacenterId);

    let primaryPcc;
    let primaryDatacenter;
    let secondaryPcc;
    let secondaryDatacenter;

    if (localSiteInformation && remoteSiteInformation) {
      if (localSiteInformation.role === this.DEDICATEDCLOUD_DATACENTER_DRP_ROLES.primary) {
        primaryPcc = {
          serviceName: currentPccInformations.serviceName,
        };
        primaryDatacenter = {
          id: currentDatacenterInformations.id,
          formattedName: currentDatacenterInformations.formattedName,
        };
        secondaryPcc = {
          serviceName: remoteSiteInformation.serviceName,
        };
        secondaryDatacenter = {
          id: remoteSiteInformation.datacenterId,
          formattedName: remoteSiteInformation.datacenterName,
        };
      } else {
        primaryPcc = {
          serviceName: remoteSiteInformation.serviceName,
        };
        primaryDatacenter = {
          id: remoteSiteInformation.datacenterId,
          formattedName: remoteSiteInformation.datacenterName,
        };
        secondaryPcc = {
          serviceName: currentPccInformations.serviceName,
        };
        secondaryDatacenter = {
          id: currentDatacenterInformations.id,
          formattedName: currentDatacenterInformations.formattedName,
        };
      }
    }

    return {
      drpType,
      state,
      primaryPcc,
      primaryDatacenter,
      secondaryPcc,
      secondaryDatacenter,
    };
  }
}
