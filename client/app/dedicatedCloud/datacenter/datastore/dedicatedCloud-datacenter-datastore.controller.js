import {
  RESOURCE_BILLING_TYPES,
  RESOURCE_UPGRADE_TYPES,
} from '../../resource/upgrade/constants';

angular
  .module('App')
  .controller('DedicatedCloudSubDatacentersDatastoreCtrl', class {
    /* @ngInject */
    constructor(
      $q,
      $scope,
      $state,
      $stateParams,
      currentService,
      DedicatedCloud,
      dedicatedCloudDataCenterDatastoreService,
    ) {
      this.$q = $q;
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.currentService = currentService;
      this.DedicatedCloud = DedicatedCloud;
      this.dedicatedCloudDataCenterDatastoreService = dedicatedCloudDataCenterDatastoreService;
    }

    $onInit() {
      this.RESOURCE_BILLING_TYPES = RESOURCE_BILLING_TYPES;
      this.RESOURCE_UPGRADE_TYPES = RESOURCE_UPGRADE_TYPES;

      this.noConsumptionResponse = new RegExp('no consumption', 'i');

      this.$scope.loadDatastores = ({ offset, pageSize }) => this
        .loadDatastores({ offset, pageSize });
      this.$scope.orderDatastore = datacenter => this.orderDatastore(datacenter);
    }

    loadDatastores({ offset, pageSize }) {
      return this.DedicatedCloud
        .getDatastores(
          this.$stateParams.productId,
          this.$stateParams.datacenterId,
          pageSize, offset - 1,
        )
        .then((result) => {
          const datastores = _.get(result, 'list.results');

          return this.$q
            .all(datastores
              .map((dc) => {
                if (dc.billing === this.RESOURCE_BILLING_TYPES.hourly) {
                  return this.dedicatedCloudDataCenterDatastoreService
                    .fetchLegacyHourlyConsumption(
                      this.$stateParams.productId,
                      this.$stateParams.datacenterId,
                      dc.id,
                    )
                    .then((response) => {
                      _.set(dc, 'consumption', _.get(response, 'consumption.value'));
                      _.set(dc, 'consumptionLastUpdate', response.lastUpdate);
                      return dc;
                    }).catch((err) => {
                      if (this.noConsumptionResponse.test(err.message)) {
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
      if (!this.currentService.usesLegacyOrder) {
        this.$state.go('app.dedicatedClouds.datacenter.datastores.order');
      } else {
        this.$scope.setAction('datacenter/datastore/orderLegacy/dedicatedCloud-datacenter-datastore-orderLegacy', datacenter.model, true);
      }
    }
  });
