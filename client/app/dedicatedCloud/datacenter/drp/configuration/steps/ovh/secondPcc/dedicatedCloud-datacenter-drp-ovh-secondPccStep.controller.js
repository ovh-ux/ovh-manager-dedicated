export default class {
  /* @ngInject */
  constructor(
    $q, $state, $stateParams, $timeout, $translate, $uibModal, $window,
    Alerter, DedicatedCloud, dedicatedCloudDrp, ipFeatureAvailability, OvhApiDedicatedCloud,
    DEDICATED_CLOUD_CONSTANTS,
    DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP,
    DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
    DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.$window = $window;
    this.Alerter = Alerter;
    this.DedicatedCloud = DedicatedCloud;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.ipFeatureAvailability = ipFeatureAvailability;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
    this.MAC_ADDRESS_REG_EXP = DEDICATEDCLOUD_DATACENTER_DRP_IP_USAGE_MAC_ADDRESS_REG_EXP;
    this.PCC_NEW_GENERATION = DEDICATED_CLOUD_CONSTANTS.pccNewGeneration;
    this.UNAVAILABLE_IP_STATUSES = DEDICATEDCLOUD_DATACENTER_DRP_UNAVAILABLE_IP_STATUS;
  }

  $onInit() {
    this.isLoading = true;
    this.drpInformations = this.$stateParams.drpInformations;

    this.availablePccs = this.pccList
      .filter(({ serviceName, location }) => serviceName !== this.$stateParams.productId
        && location !== this.drpInformations.primaryPcc.location)
      .map(pcc => ({
        description: pcc.description || pcc.serviceName,
        serviceName: pcc.serviceName,
      }));

    return this.$q.all(this.availablePccs
      .map(({ serviceName }) => this.dedicatedCloudDrp
        .getPccDrpPlan(serviceName)))
      .then((pccList) => {
        const pccWithoutDrp = _.flatten(
          pccList
            .filter(datacenters => !datacenters
              .some(({ state }) => [
                this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered,
                this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering,
                this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.provisionning,
                this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toProvision,
                this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toDisable,
                this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabling,
              ].includes(state))),
        );

        this.availablePccs = this.availablePccs
          .filter(({ serviceName }) => pccWithoutDrp
            .some(({ serviceName: pccServiceName }) => serviceName === pccServiceName));
      })
      .catch((error) => {
        this.availablePccs = [];
        this.Alerter.error(
          `${this.$translate.instant('dedicatedCloud_datacenter_drp_get_state_error')} ${_.get(error, 'data.message', error.message)}`,
          'dedicatedCloudDatacenterAlert',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
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
      ipAddressDetails: this.dedicatedCloudDrp.getPccIpAddressesDetails(secondaryPcc.serviceName),
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
      .then(({ length: hostsCount }) => {
        this.isSecondaryDatacenterWithoutHosts = hostsCount === 0;
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

  isStepValid() {
    return this.selectedSecondaryPcc
      && this.drpInformations.secondaryDatacenter
      && this.selectedSecondaryIpAddress;
  }

  validateConfiguration() {
    this.isLoading = true;

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
        this.loading = false;
      });
  }

  storeZertoOptionOrderInUserPref(drpInformations, enableDrp) {
    const drpInformationsToStore = {
      drpInformations,
      zertoOptionOrderId: enableDrp.orderId,
      zertoOption: drpInformations.drpType === this.DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh
        ? this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.ovh
        : this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.onPremise,
    };

    const { splitter } = this.DEDICATEDCLOUD_DATACENTER_ZERTO;
    const [, ...[formattedServiceName]] = drpInformations.primaryPcc.serviceName.split(splitter);
    const preferenceKey = `${this.DEDICATEDCLOUD_DATACENTER_ZERTO.title}_${formattedServiceName.replace(/-/g, '')}`;

    return this.ovhUserPref.create(preferenceKey, drpInformationsToStore);
  }
}
