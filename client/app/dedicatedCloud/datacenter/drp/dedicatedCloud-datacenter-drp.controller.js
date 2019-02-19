export default class {
  /* @ngInject */
  constructor(
    $q, $state, $stateParams, $transitions, $translate,
    Alerter,
    DEDICATEDCLOUD_DATACENTER_DRP_ROLES, DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$transitions = $transitions;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.DEDICATEDCLOUD_DATACENTER_DRP_ROLES = DEDICATEDCLOUD_DATACENTER_DRP_ROLES;
    this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
  }

  $onInit() {
    this.selectedDrpType = { id: this.$stateParams.selectedDrpType };
    this.drpInformations = { };
    this.drpInformations.hasDatacenterWithoutHosts = this.datacenterHosts.count === 0;

    this.initializeTransitions();

    const drp = this.pccPlan
      .find(({ state }) => this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.deliveredOrProvisionning
        .includes(state));

    if (drp != null) {
      this.drpInformations = {
        ...this.drpInformations,
        ...this.formatPlanInformations(drp),
      };

      return this.$state.go(`app.dedicatedClouds.datacenter.drp.${this.drpInformations.drpType}.confirmationStep`, {
        drpInformations: this.drpInformations,
      });
    }

    return this.$q.when();
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
