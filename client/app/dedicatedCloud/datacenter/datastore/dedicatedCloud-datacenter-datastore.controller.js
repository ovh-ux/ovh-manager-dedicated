angular.module('App').controller('DedicatedCloudSubDatacentersDatastoreCtrl', function ($q, $scope, $state, $stateParams, constants, DedicatedCloud) {
  $scope.constants = constants;
  const noConsumptionResponse = new RegExp('no consumption', 'i');

  this.loadDatastores = ({ offset, pageSize }) => DedicatedCloud.getDatastores(
    $stateParams.productId,
    $stateParams.datacenterId,
    pageSize,
    offset - 1,
  ).then((result) => {
    const datastores = _.get(result, 'list.results');
    return $q.all(datastores.map((dc) => {
      if (dc.billing === 'HOURLY') {
        return DedicatedCloud.getDatastoreHourlyConsumption(
          $stateParams.productId,
          $stateParams.datacenterId,
          dc.id,
        ).then((response) => {
          _.set(dc, 'consumption', _.get(response, 'consumption.value'));
          _.set(dc, 'consumptionLastUpdate', response.lastUpdate);
          return dc;
        }).catch((err) => {
          if (noConsumptionResponse.test(err.message)) {
            _.set(dc, 'consumption', 0);
          } else {
            _.set(dc, 'consumption', null);
          }
          return dc;
        });
      }
      return $q.when(dc);
    })).then(data => ({
      data,
      meta: {
        totalCount: result.count,
      },
    }));
  });

  this.orderDatastore = (datacenter) => {
    if (constants.target === 'US') {
      $state.go('app.dedicatedClouds.datacenter.datastores.orderUS');
    } else {
      $scope.setAction('datacenter/datastore/order/dedicatedCloud-datacenter-datastore-order', datacenter.model, true);
    }
  };
});
