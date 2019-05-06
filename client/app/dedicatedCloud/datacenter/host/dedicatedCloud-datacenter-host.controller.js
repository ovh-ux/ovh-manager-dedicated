import {
  RESOURCE_BILLING_TYPES,
  RESOURCE_UPGRADE_TYPES,
} from '../../resource/upgrade/constants';

angular
  .module('App')
  .controller('DedicatedCloudSubDatacentersHostCtrl', class {
    /* @ngInject */
    constructor(
      $q,
      $scope,
      $state,
      $stateParams,
      currentService,
      DedicatedCloud,
      dedicatedCloudDatacenterService,
      dedicatedCloudDataCenterHostService,
      DEDICATED_CLOUD_DATACENTER,
    ) {
      this.$q = $q;
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.currentService = currentService;
      this.DedicatedCloud = DedicatedCloud;
      this.dedicatedCloudDatacenterService = dedicatedCloudDatacenterService;
      this.dedicatedCloudDataCenterHostService = dedicatedCloudDataCenterHostService;
      this.DEDICATED_CLOUD_DATACENTER = DEDICATED_CLOUD_DATACENTER;
    }

    $onInit() {
      this.RESOURCE_BILLING_TYPES = RESOURCE_BILLING_TYPES;
      this.RESOURCE_UPGRADE_TYPES = RESOURCE_UPGRADE_TYPES;

      return this.fetchDatacenterInfoProxy();
    }

    fetchDatacenterInfoProxy() {
      this.loading = true;

      return this.DedicatedCloud
        .getDatacenterInfoProxy(this.$stateParams.productId, this.$stateParams.datacenterId)
        .then(({ commercialRangeName }) => {
          this.$scope.datacenter.model.commercialRangeName = commercialRangeName;
          this.$scope.datacenter.model.hasDiscountAMD = this.DedicatedCloud
            .hasDiscount(this.$scope.datacenter.model);
        })
        .finally(() => {
          this.loading = false;
        });
    }

    fetchLegacyHostConsumption(hosts) {
      return this.$q.all(hosts
        .map(host => (host.billingType === this.RESOURCE_BILLING_TYPES.hourly
          ? this.dedicatedCloudDataCenterHostService
            .getHostHourlyConsumption(
              this.$stateParams.productId,
              this.$stateParams.datacenterId,
              host.hostId,
            )
            .then(consumption => ({ ...host, ...consumption }))
            .catch(() => host)
          : host)));
    }

    fetchConsumptionForHosts(hosts) {
      return serviceConsumption => this.$q.all(
        hosts.map(
          this.fetchConsumptionForHost(serviceConsumption),
        ),
      );
    }

    fetchConsumptionForHost(serviceConsumption) {
      return (host) => {
        if (host.billingType === this.RESOURCE_BILLING_TYPES.hourly) {
          const hostConsumption = this.dedicatedCloudDatacenterService.constructor
            .extractElementConsumption(serviceConsumption, {
              id: host.hostId,
              type: this.DEDICATED_CLOUD_DATACENTER.elementTypes.host,
            });

          return {
            ...host,
            consumption: {
              value: hostConsumption.quantity,
            },
            lastUpdate: serviceConsumption.lastUpdate,
          };
        }

        return host;
      };
    }

    chooseConsumptionFetchingMethod(hosts) {
      return !this.currentService.usesLegacyOrder
        ? this.dedicatedCloudDatacenterService
          .fetchConsumptionForService(this.currentService.serviceInfos.serviceId)
          .then(this.fetchConsumptionForHosts(hosts))
        : this.fetchLegacyHostConsumption(hosts);
    }

    loadHosts({ offset, pageSize }) {
      return this.DedicatedCloud
        .getPaginatedHosts(
          this.$stateParams.productId,
          this.$stateParams.datacenterId,
          pageSize,
          offset - 1,
        )
        .then(result => this.chooseConsumptionFetchingMethod(result.list.results)
          .then(hostsWithConsumption => ({
            data: hostsWithConsumption,
            meta: {
              totalCount: result.count,
            },
          })));
    }

    orderHost(datacenter) {
      if (!this.currentService.usesLegacyOrder) {
        this.$state.go('app.dedicatedClouds.datacenter.hosts.order');
      } else {
        this.$scope.setAction('datacenter/host/orderLegacy/dedicatedCloud-datacenter-host-orderLegacy', datacenter.model, true);
      }
    }
  });
