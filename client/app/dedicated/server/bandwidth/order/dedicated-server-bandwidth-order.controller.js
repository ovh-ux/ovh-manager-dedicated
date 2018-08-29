angular.module('App').controller('ServerOrderBandwidthCtrl', ($scope, $stateParams, $translate, Server, User) => {
  $scope.orderable = null;

  $scope.orderableBandwidth = {
    value: [],
  };

  $scope.selectedBandwidthTypes = {
    value: null,
  };

  $scope.selectedBandwidth = {
    value: null,
  };

  $scope.loaders = {
    orderableVersion: true,
    durations: false,
    bc: false,
  };

  /*
    *
    *  ORDERABLE
    *
    */
  $scope.getOrderableVersion = function () {
    $scope.loaders.orderableVersion = true;
    $scope.orderableBandwidth.value = [];
    $scope.user = {
      value: null,
    };

    User.getUser()
      .then((data) => {
        $scope.user.value = data;
      })
      .then(() => {
        Server.get($stateParams.productId, 'orderable/bandwidth', {
          proxypass: true,
        }).then((orderableVersion) => {
          $scope.orderable = orderableVersion;

          angular.forEach(orderableVersion, (value, key) => {
            if (key !== 'orderable' && $scope.orderable[key]) {
              angular.forEach(value, (v, k) => {
                $scope.orderable[key][k] = Math.floor(v / 1000);
              });

              if ($scope.orderable[key].length) {
                $scope.orderableBandwidth.value.push(key);
              }
            }
          });
          $scope.orderableBandwidth.value = _.sortBy($scope.orderableBandwidth.value, (val) => {
            let ret;
            switch (val) {
              case 'premium':
                ret = 1;
                break;
              case 'platinum':
                ret = 2;
                break;
              default:
                ret = 3;
                break;
            }
            return ret;
          });

          $scope.loaders.orderableVersion = false;
        });
      });
  };

  $scope.selectBandwidthType = function (type) {
    if ($scope.orderable[type].length === 1) {
      $scope.selectedBandwidthTypes.value = type;
      $scope.selectedBandwidth.value = _.first($scope.orderable[type]);
    } else {
      $scope.selectedBandwidth.value = null;
    }
  };

  /*
    *
    *  DURATIONS && PRICE
    *
    */
  $scope.durations = {
    value: {},
    selected: null,
  };

  $scope.user = {
    value: null,
  };

  $scope.getDuration = function () {
    $scope.durations.value = {};
    $scope.loaders.durations = true;

    Server.orderBandwidth($stateParams.productId, {
      serviceName: $scope.currentActionData,
      bandwidth: $scope.selectedBandwidth.value * 1000,
      type: $scope.selectedBandwidthTypes.value,
    }).then((durations) => {
      $scope.durations.value = durations;

      if ($scope.durations.value.length === 1) {
        $scope.durations.selected = $scope.durations.value[0].durations;
      }

      $scope.loaders.durations = false;
    });
  };

  /*
    *
    *  CONTRACTS
    *
    */
  $scope.contracts = {
    value: [],
  };

  $scope.agree = {
    value: false,
  };

  let bcUrl;
  $scope.displayBc = function () {
    $scope.loaders.bc = true;
    bcUrl = null;

    $scope.agree.value = false;
    $scope.contracts.value = [];

    return Server.postOrderBandwidth($stateParams.productId, {
      serviceName: $scope.currentActionData,
      bandwidth: $scope.selectedBandwidth.value * 1000,
      type: $scope.selectedBandwidthTypes.value,
      duration: $scope.durations.selected,
    }).then(
      (durations) => {
        $scope.loaders.bc = false;
        $scope.contracts.value = durations.contracts;

        bcUrl = durations.url;
      },
      (data) => {
        $scope.resetAction();
        $scope.setMessage($translate.instant('server_order_bandwidth_error'), data.data);
      },
    );
  };

  /*
    *
    *  OPEN BC
    *
    */
  $scope.openBC = function () {
    $scope.resetAction();
    window.open(bcUrl);
  };
});
