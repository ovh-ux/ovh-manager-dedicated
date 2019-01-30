angular.module('App').controller('DedicatedCloudDatacenterDrpFirstStepCtrl', class DedicatedCloudDatacenterDrpFirstStepCtrl {
  /* @ngInject */
  constructor(
    $q, $state, $stateParams, $translate, $uibModal,
    Alerter, DedicatedCloud, DedicatedCloudDrp, OvhApiDedicatedCloud,
    DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
    DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.DedicatedCloud = DedicatedCloud;
    this.DedicatedCloudDrp = DedicatedCloudDrp;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.unavailableIpStatuses = DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS;
    this.macAddressRegExp = DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP;
  }

  $onInit() {
    this.loading = true;
    this.drpInformations = this.$stateParams.drpInformations;

    return this.$q.all({
      datacenters:
        this.DedicatedCloud.getDatacenters(this.$stateParams.productId),
      ipAddressDetails:
        this.DedicatedCloudDrp.getPccIpAddressesDetails(this.$stateParams.productId),
      pcc: this.OvhApiDedicatedCloud.v6().get({
        serviceName: this.$stateParams.productId,
      }),
    })
      .then(({ datacenters, ipAddressDetails, pcc }) => {
        this.drpInformations.primaryPcc = pcc;
        this.availableDatacenters = datacenters.results;
        this.availableIpAddress = ipAddressDetails
          .filter(({ usageDetails }) => _.isNull(usageDetails)
            && !this.unavailableIpStatuses.includes(usageDetails)
            && !this.macAddressRegExp.test(usageDetails));

        this.drpInformations.primaryDatacenter = this.availableDatacenters
          .find(({ id }) => parseInt(this.$stateParams.datacenterId, 10) === id);
        this.selectedIpAddress = this.availableIpAddress
          .find(({ ip }) => ip === this.$stateParams.drpInformations.primaryEndpointIp);
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_drp_get_state_error')} ${_.get(error, 'data.message', error)}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  openModalOrderIpBlock() {
    this.$uibModal.open({
      templateUrl: 'ip/ip/order/ip-ip-order.html',
      controller: 'IpOrderCtrl',
      controllerAs: '$ctrl',
    }).result
      .then(() => this.DedicatedCloudDrp.getPccIpAddressesDetails(this.$stateParams.productId))
      .then((ipAddressDetails) => {
        this.availableIpAddress = ipAddressDetails
          .filter(({ usageDetails }) => _.isNull(usageDetails)
            && !this.unavailableIpStatuses.includes(usageDetails)
            && !this.macAddressRegExp.test(usageDetails));
      });
  }

  goToPreviousStep() {
    this.$state.go('app.dedicatedClouds.datacenter.drp', { selectedDrpType: this.drpInformations.drpType });
  }

  goToNextStep() {
    this.$state.go(`app.dedicatedClouds.datacenter.drp.${this.drpInformations.drpType}.secondStep`, { drpInformations: this.drpInformations });
  }
});
