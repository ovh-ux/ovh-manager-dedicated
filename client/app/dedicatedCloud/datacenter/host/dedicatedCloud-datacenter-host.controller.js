angular
  .module('App')
  .controller(
    'DedicatedCloudSubDatacentersHostCtrl',
    class {
      /* @ngInject */
      constructor(
        $q,
        $scope,
        $state,
        $stateParams,
        $translate,

        DedicatedCloud,
        currentService,
      ) {
        this.$q = $q;
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;

        this.DedicatedCloud = DedicatedCloud;
        this.currentService = currentService;
      }

      $onInit() {
        this.loading = true;

        return this.DedicatedCloud
          .getDatacenterInfoProxy(
            this.$stateParams.productId,
            this.$stateParams.datacenterId,
          )
          .then((datacenter) => {
            this.$scope.datacenter.model = {
              ...this.$scope.datacenter.model,
              commercialRangeName: datacenter.commercialRangeName,
              hasDiscountAMD: this.DedicatedCloud.hasDiscount(this.$scope.datacenter.model),
            };
          })
          .finally(() => {
            this.loading = false;
          });
      }

      loadHosts({
        offset,
        pageSize,
      }) {
        return this.DedicatedCloud
          .getHosts(
            this.$stateParams.productId,
            this.$stateParams.datacenterId,
            pageSize,
            offset - 1,
          )
          .then((result) => {
            const hosts = _.get(result, 'list.results', []);

            return this.$q
              .all(hosts.map((host) => {
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
        if (!this.currentService.usesLegacyOrder) {
          this.$state.go('app.dedicatedClouds.datacenter.hosts.orderUS');
        } else {
          this.$scope.setAction('datacenter/host/order/dedicatedCloud-datacenter-host-order', datacenter.model, true);
        }
      }
    },
  );
