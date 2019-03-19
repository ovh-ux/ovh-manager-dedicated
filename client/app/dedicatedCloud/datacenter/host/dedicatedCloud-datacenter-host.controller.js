angular
  .module('App')
  .controller('DedicatedCloudSubDatacentersHostCtrl', class {
    /* @ngInject */
    constructor(
      $q,
      $scope,
      $state,
      $stateParams,
      constants,
      coreConfig,
      DedicatedCloud,
    ) {
      this.$q = $q;
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.constants = constants;
      this.coreConfig = coreConfig;
      this.DedicatedCloud = DedicatedCloud;
    }

    $onInit() {
      return this.fetchDatacenterInfoProxy();
    }

    fetchDatacenterInfoProxy() {
      this.loading = true;

      return this.DedicatedCloud
        .getDatacenterInfoProxy(this.$stateParams.productId, this.$stateParams.datacenterId)
        .then((datacenter) => {
          this.$scope.datacenter.model.commercialRangeName = datacenter.commercialRangeName;
          this.$scope.datacenter.model.hasDiscountAMD = this.DedicatedCloud
            .hasDiscount(this.$scope.datacenter.model);
        })
        .finally(() => {
          this.loading = false;
        });
    }

    loadHosts({ offset, pageSize }) {
      return this.DedicatedCloud
        .getPaginatedHosts(
          this.$stateParams.productId,
          this.$stateParams.datacenterId,
          pageSize,
          offset - 1,
        )
        .then((result) => {
          const hosts = _.get(result, 'list.results');

          return this.$q
            .all(hosts
              .map((host) => {
                if (host.billingType === 'HOURLY') {
                  return this.DedicatedCloud
                    .getHostHourlyConsumption(
                      this.$stateParams.productId,
                      this.$stateParams.datacenterId,
                      host.hostId,
                    )
                    .then(consumption => _.merge({}, host, consumption))
                    .catch(() => host);
                }

                return this.$q.when(host);
              }))
            .then(hostsWithConsumption => ({
              data: hostsWithConsumption,
              meta: {
                totalCount: result.count,
              },
            }));
        });
    }

    orderHost(datacenter) {
      if (this.coreConfig.getRegion() === 'US') {
        this.$state.go('app.dedicatedClouds.datacenter.hosts.order');
      } else {
        this.$scope.setAction('datacenter/host/orderLegacy/dedicatedCloud-datacenter-host-orderLegacy', datacenter.model, true);
      }
    }
  });
