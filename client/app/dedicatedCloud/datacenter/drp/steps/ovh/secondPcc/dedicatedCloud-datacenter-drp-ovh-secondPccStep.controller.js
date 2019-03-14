export default class {
  /* @ngInject */
  constructor(
    $q, $state, $stateParams, $translate, $uibModal,
    Alerter, DedicatedCloud, DedicatedCloudDrp, ipFeatureAvailability, OvhApiDedicatedCloud,
    DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP,
    DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.DedicatedCloud = DedicatedCloud;
    this.DedicatedCloudDrp = DedicatedCloudDrp;
    this.ipFeatureAvailability = ipFeatureAvailability;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.MAC_ADDRESS_REG_EXP = DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP;
    this.UNAVAILABLE_IP_STATUSES = DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS;
  }

  $onInit() {
    this.drpInformations = this.$stateParams.drpInformations;

    this.availablePccs = this.pccList
      .filter(({ serviceName, location }) => serviceName !== this.$stateParams.productId
        && location !== this.drpInformations.primaryPcc.location)
      .map(pcc => ({
        description: pcc.description || pcc.serviceName,
        serviceName: pcc.serviceName,
      }));
  }

  updateOptions(secondaryPcc) {
    this.fetchingOptions = true;

    this.drpInformations.secondaryPcc = secondaryPcc;
    this.drpInformations.secondaryDatacenter = null;
    this.selectedSecondaryIpAddress = null;

    this.OvhApiDedicatedCloud.Ip().v6().resetQueryCache();
    this.OvhApiDedicatedCloud.Ip().v6().resetCache();

    return this.$q.all({
      datacenters: this.DedicatedCloud.getDatacenters(secondaryPcc.serviceName),
      ipAddressDetails: this.DedicatedCloudDrp.getPccIpAddressesDetails(secondaryPcc.serviceName),
    })
      .then(({ datacenters, ipAddressDetails }) => {
        this.availableDatacenters = datacenters.results;
        this.availableIpAddress = ipAddressDetails
          .filter(({ usageDetails }) => _.isNull(usageDetails)
            && !this.UNAVAILABLE_IP_STATUSES.includes(usageDetails)
            && !this.MAC_ADDRESS_REG_EXP.test(usageDetails));
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_drp_get_state_error')} ${_.get(error, 'data.message', error)}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.fetchingOptions = false;
      });
  }

  checkIfDatacenterHasHosts(datacenterId) {
    this.isCheckingHosts = true;
    this.isSecondaryDatacenterWithoutHosts = false;
    this.hostsStateLink = '';

    return this.DedicatedCloud.getHosts(
      this.drpInformations.secondaryPcc.serviceName,
      datacenterId,
    )
      .then(({ count }) => {
        this.isSecondaryDatacenterWithoutHosts = count === 0;
        if (this.isSecondaryDatacenterWithoutHosts) {
          this.hostsStateLink = `app.dedicatedClouds.datacenter.hosts({ productId: '${this.drpInformations.secondaryPcc.serviceName}', datacenterId: ${datacenterId} })`;
        }
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_secondary_datacenter_get_hosts_error')} ${_.get(error, 'data.message', '')}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.isCheckingHosts = false;
      });
  }

  goToPreviousStep() {
    return this.$state.go('app.dedicatedClouds.datacenter.drp.ovh.mainPccStep', { drpInformations: this.drpInformations });
  }

  goToNextStep() {
    return this.$state.go('app.dedicatedClouds.datacenter.drp.ovh.confirmationStep', { drpInformations: this.drpInformations });
  }

  isStepValid() {
    return this.selectedSecondaryPcc
      && this.drpInformations.secondaryDatacenter
      && this.selectedSecondaryIpAddress;
  }
}
