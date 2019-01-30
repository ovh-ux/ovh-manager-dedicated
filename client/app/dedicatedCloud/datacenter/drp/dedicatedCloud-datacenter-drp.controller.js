angular.module('App').controller('DedicatedCloudDatacenterDrpCtrl', class DedicatedCloudDatacenterDrpCtrl {
  /* @ngInject */
  constructor(
    $q, $state, $stateParams, $translate,
    Alerter, DedicatedCloud, DedicatedCloudDrp,
    DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.DedicatedCloud = DedicatedCloud;
    this.DedicatedCloudDrp = DedicatedCloudDrp;
    this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
  }

  $onInit() {
    this.loading = true;
    this.selectedDrpType = { id: this.$stateParams.selectedDrpType };
    this.drpInformations = { };

    return this.$q.all({
      datacenterList: this.DedicatedCloud.getDatacenters(this.$stateParams.productId),
      datacenterHosts: this.DedicatedCloud.getHosts(
        this.$stateParams.productId,
        this.$stateParams.datacenterId,
      ),
      pccList: this.DedicatedCloud.getAllPccs(),
      pccPlan: this.DedicatedCloudDrp.getPccDrpPlan(this.$stateParams.productId),
    })
      .then(({
        datacenterHosts, datacenterList, pccList, pccPlan,
      }) => {
        this.datacenterList = datacenterList.results;
        this.pccList = pccList;

        this.drpInformations.hasDatacenterWithoutHosts = datacenterHosts.count === 0;
        const drp = pccPlan
          .find(({ state }) => this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.deliveredOrProvisionning
            .includes(state));

        if (drp) {
          this.drpInformations = angular
            .extend(this.drpInformations, this.formatPlanInformations(drp));

          this.$state.go(`app.dedicatedClouds.datacenter.drp.${this.drpInformations.drpType}.finalStep`, {
            drpInformations: this.drpInformations,
          });
        }
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_drp_get_state_error')} ${_.get(error, 'message', '')}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  selectDrpType() {
    this.drpInformations.drpType = this.selectedDrpType.id;
    this.$state.go(`app.dedicatedClouds.datacenter.drp.${this.selectedDrpType.id}.firstStep`, {
      drpInformations: this.drpInformations,
    });
  }

  formatPlanInformations({
    datacenterId, drpType, localSiteInformation, remoteSiteInformation, serviceName, state,
  }) {
    const currentPccInformations = this.pccList
      .find(({ serviceName: pccServiceName }) => pccServiceName === serviceName);
    const currentDatacenterInformations = this.datacenterList
      .find(({ id }) => id === datacenterId);

    let primaryPcc;
    let primaryDatacenter;
    let secondaryPcc;
    let secondaryDatacenter;

    if (localSiteInformation && remoteSiteInformation) {
      if (localSiteInformation.role === 'primary') {
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
      } else if (remoteSiteInformation.role === 'primary') {
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
});
