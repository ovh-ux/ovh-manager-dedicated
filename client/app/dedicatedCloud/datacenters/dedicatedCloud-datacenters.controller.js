angular
  .module('App')
  .controller(
    'DedicatedCloudDatacentersCtrl',
    class {
      /* @ngInject */
      constructor(
        $q,
        $scope,
        $state,
        $stateParams,

        DedicatedCloud,
        serviceUsesAgora,
      ) {
        this.$q = $q;
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;

        this.DedicatedCloud = DedicatedCloud;
        this.serviceUsesAgora = serviceUsesAgora;
      }

      loadDatacenters({
        offset,
        pageSize,
      }) {
        return this.DedicatedCloud
          .getDatacentersInformations(
            this.$stateParams.productId,
            pageSize,
            offset - 1,
          )
          .then(result => ({
            data: _.get(result, 'list.results', []),
            meta: {
              totalCount: result.count,
            },
          }))
          .catch((err) => {
            this.$scope.resetAction();
            this.$scope.setMessage(
              this.$translate.instant('dedicatedCloud_datacenters_loading_error'),
              {
                message: err.message,
                type: 'ERROR',
              },
            );
          })
          .finally(() => {
            this.$scope.loading = false;
          });
      }

      hasDiscount(datacenter) {
        const hasDiscount = this.DedicatedCloud.hasDiscount(datacenter);

        if (hasDiscount) {
          this.$scope.discount.AMDPCC = true;
        }

        return hasDiscount;
      }

      orderDatastore(datacenter) {
        if (this.serviceUsesAgora) {
          this.$state.go(
            'app.dedicatedClouds.datacenter.datastores.orderUS',
            {
              datacenterId: datacenter.id,
            },
          );
        } else {
          this.$scope.setAction(
            'datacenter/datastore/order/dedicatedCloud-datacenter-datastore-order',
            datacenter,
            true,
          );
        }
      }

      orderHost(datacenter) {
        if (this.serviceUsesAgora) {
          this.$state.go(
            'app.dedicatedClouds.datacenter.hosts.orderUS',
            {
              datacenterId: datacenter.id,
            },
          );
        } else {
          this.$scope.setAction(
            'datacenter/host/order/dedicatedCloud-datacenter-host-order',
            datacenter,
            true,
          );
        }
      }
    },
  );
