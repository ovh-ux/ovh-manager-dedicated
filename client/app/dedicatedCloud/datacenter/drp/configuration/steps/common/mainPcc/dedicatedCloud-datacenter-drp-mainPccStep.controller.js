export default class {
  /* @ngInject */
  constructor(
    $q, $state, $stateParams, $translate, $uibModal,
    Alerter, dedicatedCloudDrp, ipFeatureAvailability, OvhApiDedicatedCloud,
    DEDICATEDCLOUD_DATACENTER_DRP_IP_BLOCK_REG_EXP,
    DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP,
    DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
    DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.ipFeatureAvailability = ipFeatureAvailability;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.IP_BLOCK_REG_EXP = DEDICATEDCLOUD_DATACENTER_DRP_IP_BLOCK_REG_EXP;
    this.DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
    this.MAC_ADDRESS_REG_EXP = DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP;
    this.UNAVAILABLE_IP_STATUSES = DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS;
  }

  $onInit() {
    this.isLoading = true;
    this.drpInformations = this.$stateParams.drpInformations;

    this.OvhApiDedicatedCloud.Ip().v6().resetQueryCache();
    this.OvhApiDedicatedCloud.Ip().v6().resetCache();

    return this.$q.all({
      defaultLocalVraNetwork:
        this.drpInformations.drpType === this.DRP_OPTIONS.onPremise
          ? this.getDefaultLocalVraNetwork({
            datacenterId: this.$stateParams.datacenterId,
            serviceName: this.$stateParams.productId,
          }) : this.$q.when(null),
      ipAddressDetails:
        this.dedicatedCloudDrp.getPccIpAddressesDetails(this.$stateParams.productId),
      pcc: this.OvhApiDedicatedCloud.v6().get({
        serviceName: this.$stateParams.productId,
      }),
    })
      .then(({ ipAddressDetails, pcc }) => {
        this.drpInformations.primaryPcc = pcc;
        this.availableDatacenters = this.datacenters;
        this.availableIpAddress = this.getAvailableAddresses(ipAddressDetails);

        this.drpInformations.primaryDatacenter = this.availableDatacenters
          .find(({ id }) => parseInt(this.$stateParams.datacenterId, 10) === id);
        this.selectedIpAddress = this.availableIpAddress
          .find(({ ip }) => ip === this.$stateParams.drpInformations.primaryEndpointIp);
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_drp_get_state_error')} ${_.get(error, 'data.message', error)}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getAvailableAddresses(ipAddressDetails) {
    return ipAddressDetails
      .filter(({ usageDetails }) => _.isNull(usageDetails)
        && !this.UNAVAILABLE_IP_STATUSES.includes(usageDetails)
        && !this.MAC_ADDRESS_REG_EXP.test(usageDetails));
  }

  goToPreviousStep() {
    return this.$state.go(
      'app.dedicatedClouds.datacenter.drp.choice',
      { selectedDrpType: this.drpInformations.drpType },
    );
  }

  goToNextStep() {
    const stateToGo = this.drpInformations.drpType === this.DRP_OPTIONS.ovh
      ? 'ovh.secondPccStep' : 'onPremise.onPremisePccStep';
    return this.$state.go(`app.dedicatedClouds.datacenter.drp.${stateToGo}`, { drpInformations: this.drpInformations });
  }

  getDefaultLocalVraNetwork({ datacenterId, serviceName }) {
    return this.dedicatedCloudDrp.getDefaultLocalVraNetwork({
      datacenterId,
      serviceName,
    })
      .then((defaultLocalVraNetwork) => {
        this.drpInformations.localVraNetwork = defaultLocalVraNetwork;
      });
  }
}
