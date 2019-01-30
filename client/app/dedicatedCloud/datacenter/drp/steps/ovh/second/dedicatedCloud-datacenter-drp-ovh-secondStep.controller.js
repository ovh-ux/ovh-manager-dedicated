angular.module('App').controller('DedicatedCloudDatacenterDrpOvhSecondStepCtrl', class DedicatedCloudDatacenterDrpTwoOvhPccSecondStepCtrl {
  /* @ngInject */
  constructor(
    $q, $state, $stateParams, $translate, $uibModal,
    Alerter, DedicatedCloud, DedicatedCloudDrp,
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
    this.unavailableIpStatuses = DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS;
    this.macAddressRegExp = DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP;
  }

  $onInit() {
    this.loading = true;
    this.drpInformations = this.$stateParams.drpInformations;

    return this.DedicatedCloud.getAllPccs()
      .then((availablePccs) => {
        this.availablePccs = availablePccs
          .filter(({ serviceName }) => serviceName !== this.$stateParams.productId)
          .map(pcc => ({
            description: pcc.description || pcc.serviceName,
            serviceName: pcc.serviceName,
          }));
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_drp_get_state_error')} ${_.get(error, 'data.message', error.messsage)}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.loading = false;
      });
  }

  updateOptions(secondaryPcc) {
    this.fetchingPccOptions = true;
    this.drpInformations.secondaryPcc = secondaryPcc;
    this.drpInformations.secondaryDatacenter = null;
    this.selectedSecondaryIpAddress = null;
    return this.$q.all({
      datacenters: this.DedicatedCloud.getDatacenters(secondaryPcc.serviceName),
      ipAddressDetails: this.DedicatedCloudDrp.getPccIpAddressesDetails(secondaryPcc.serviceName),
    })
      .then(({ datacenters, ipAddressDetails }) => {
        this.availableDatacenters = datacenters.results;
        this.availableIpAddress = ipAddressDetails
          .filter(({ usageDetails }) => _.isNull(usageDetails)
            && !this.unavailableIpStatuses.includes(usageDetails)
            && !this.macAddressRegExp.test(usageDetails));
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_drp_get_state_error')} ${_.get(error, 'data.message', error)}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.fetchingPccOptions = false;
      });
  }

  goToPreviousStep() {
    this.$state.go('app.dedicatedClouds.datacenter.drp.ovh.firstStep', { drpInformations: this.drpInformations });
  }

  goToNextStep() {
    this.$state.go('app.dedicatedClouds.datacenter.drp.ovh.finalStep', { drpInformations: this.drpInformations });
  }

  openModalOrderIpBlock() {
    this.$uibModal.open({
      templateUrl: 'ip/ip/order/ip-ip-order.html',
      controller: 'IpOrderCtrl',
      controllerAs: '$ctrl',
    }).result
      .then(() => this.DedicatedCloudDrp
        .getPccIpAddressesDetails(this.selectedSecondaryPcc.serviceName))
      .then((ipAddressDetails) => {
        this.availableIpAddress = ipAddressDetails
          .filter(({ usageDetails }) => _.isNull(usageDetails)
            && !this.unavailableIpStatuses.includes(usageDetails)
            && !this.macAddressRegExp.test(usageDetails));
      });
  }

  isStepValid() {
    return this.selectedSecondaryPcc
      && this.drpInformations.secondaryDatacenter
      && this.selectedSecondaryIpAddress;
  }
});
