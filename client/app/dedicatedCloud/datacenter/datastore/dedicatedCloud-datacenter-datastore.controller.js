angular
  .module('App')
  .controller(
    'DedicatedCloudSubDatacentersDatastoreCtrl',
    class {
      /* @ngInject */
      constructor(
        $q,
        $scope,
        $state,
        $stateParams,

        constants,
        DedicatedCloud,
      ) {
        this.$q = $q;
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;

        this.constants = constants;
        this.DedicatedCloud = DedicatedCloud;
      }

      $onInit() {
        this.$scope.constants = this.constants;
      }

      loadDatastores({
        offset,
        pageSize,
      }) {
        const noConsumptionResponse = new RegExp(
          'no consumption',
          'i',
        );

        return this.DedicatedCloud
          .getDatastores(
            this.$stateParams.productId,
            this.$stateParams.datacenterId,
            pageSize,
            offset - 1,
          )
          .then((result) => {
            const datastores = _.get(
              result,
              'list.results',
            );

            return this.$q
              .all(datastores.map((dc) => {
                if (dc.billing === 'HOURLY') {
                  return this.DedicatedCloud
                    .getDatastoreHourlyConsumption(
                      this.$stateParams.productId,
                      this.$stateParams.datacenterId,
                      dc.id,
                    )
                    .then((response) => {
                      _.set(dc, 'consumption', _.get(response, 'consumption.value'));
                      _.set(dc, 'consumptionLastUpdate', response.lastUpdate);

                      return dc;
                    })
                    .catch((err) => {
                      if (noConsumptionResponse.test(err.message)) {
                        _.set(dc, 'consumption', 0);
                      } else {
                        _.set(dc, 'consumption', null);
                      }

                      return dc;
                    });
                }
                return this.$q.when(dc);
              }))
              .then(data => ({
                data,
                meta: {
                  totalCount: result.count,
                },
              }));
          });
      }

      orderDatastore(datacenter) {
        if (this.constants.target === 'US') {
          this.$state.go('app.dedicatedClouds.datacenter.datastores.orderUS');
        } else {
          this.$scope.setAction(
            'datacenter/datastore/order/dedicatedCloud-datacenter-datastore-order',
            datacenter.model,
            true,
          );
        }
      }
    },
  );
