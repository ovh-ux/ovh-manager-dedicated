

angular.module('App').controller('DedicatedCloudHostToMonthlyCtrl', ($stateParams, $rootScope, $scope, $q, $window, $translate, DedicatedCloud, Alerter, User) => {
  const resourceId = $scope.currentActionData ? $scope.currentActionData.id : null;
  const resourceType = $scope.currentActionData ? $scope.currentActionData.type : null;
  const upgradeType = $scope.currentActionData ? $scope.currentActionData.upgradeType : null;

  $scope.ovhSubsidiary = User.getUser().then(user => user.ovhSubsidiary);

  $scope.model = {
    capacity: null,
    duration: null,
  };
  $scope.loading = {
    durations: null,
  };

  $scope.agree = {
    value: false,
  };

  /*= =============================
  =            STEP 1            =
  ============================== */

  function loadPrices(durations) {
    const queue = [];
    $scope.loading.prices = true;

    angular.forEach(durations, (duration) => {
      queue.push(
        DedicatedCloud
          .getUpgradeResourceOrder(
            $stateParams.productId,
            upgradeType,
            duration,
            resourceType,
            resourceId,
          )
          .then((details) => {
            $scope.durations.details[duration] = details;
          }),
      );
    });

    $q.all(queue).then(
      () => {
        if (durations && durations.length === 1) {
          $scope.model.duration = _.first(durations);
        }
        $scope.loading.prices = false;
      },
      (data) => {
        Alerter.alertFromSWS($translate.instant('dedicatedCloud_order_loading_error'), data.data);
        $scope.loading.durations = false;
      },
    );
  }

  $scope.getDurations = function () {
    $scope.durations = {
      available: null,
      details: {},
    };
    $scope.loading.durations = true;

    DedicatedCloud
      .getUpgradeResourceDurations($stateParams.productId, upgradeType, resourceType, resourceId)
      .then((durations) => {
        $scope.loading.durations = false;
        $scope.durations.available = durations;
        loadPrices(durations);
      });
  };

  /*= =============================
  =            STEP 2            =
  ============================== */

  $scope.loadContracts = function () {
    $scope.agree.value = false;
    if (!$scope.durations.details[$scope.model.duration].contracts
      || !$scope.durations.details[$scope.model.duration].contracts.length) {
      $rootScope.$broadcast('wizard-goToStep', 5);
    }
  };

  $scope.backToContracts = function () {
    if (!$scope.durations.details[$scope.model.duration].contracts
      || !$scope.durations.details[$scope.model.duration].contracts.length) {
      $rootScope.$broadcast('wizard-goToStep', 2);
    }
  };

  /*= =============================
  =            STEP 3            =
  ============================== */

  $scope.getResumePrice = function (price) {
    return price.value === 0 ? $translate.instant('price_free') : $translate.instant('price_ht_label', { t0: price.text });
  };

  $scope.upgradedResource = function () {
    $scope.loading.validation = true;
    let orderUrl = '';

    // You cannot call window.open in an async call in safari (like the follow promise)
    // so hold a ref to a new window and set the url once it get it.
    const windowRef = $window.open();
    DedicatedCloud
      .upgradedResource(
        $stateParams.productId,
        upgradeType,
        $scope.model.duration,
        resourceType,
        resourceId,
      )
      .then((order) => {
        const message = $translate.instant('dedicatedCloud_order_finish_success', {
          t0: order.url,
          t1: order.orderId,
        });
        $scope.setMessage(message, true);
        Alerter.alertFromSWS(message, { idTask: order.orderId, state: 'OK' });
        orderUrl = order.url;
        $scope.resetAction();
      })
      .catch((data) => {
        const message = $translate.instant('dedicatedCloud_order_finish_error');
        $scope.setMessage(message, angular.extend(data, { type: 'ERROR' }));
        Alerter.alertFromSWS(message, data.data);
      })
      .finally(() => {
        $scope.loading.validation = false;
        if (_.isEmpty(orderUrl)) {
          windowRef.close();
        } else {
          windowRef.location = orderUrl;
        }
      });
  };
});
