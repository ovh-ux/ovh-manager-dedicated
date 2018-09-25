angular.module('App').controller('DedicatedCloudSubDatacenterVeeamCtrl', ($scope, $stateParams, $translate, DedicatedCloud, $rootScope, VEEAM_STATE_ENUM, constants) => {
  $scope.veeam = {
    model: null,
    constants: VEEAM_STATE_ENUM,
  };
  $scope.loading = false;
  $scope.isUS = constants.target === 'US';

  $rootScope.$on('datacenter.veeam.reload', () => {
    $scope.loadVeeam(true);
  });

  $scope.loadVeeam = function (forceRefresh) {
    $scope.loading = true;

    return DedicatedCloud
      .getVeeam($stateParams.productId, $stateParams.datacenterId, forceRefresh)
      .then((veeam) => {
        $scope.veeam.model = veeam;
        $scope.loading = false;
      })
      .catch((data) => {
        $scope.loading = false;
        $scope.setMessage($translate.instant('dedicatedCloud_tab_veeam_loading_error'), angular.extend(data, { type: 'ERROR' }));
      });
  };

  $scope.canBeActivated = function () {
    return $scope.veeam.model && $scope.veeam.model.state === $scope.veeam.constants.DISABLED;
  };

  $scope.canBeDisabled = function () {
    return $scope.veeam.model && $scope.veeam.model.state === $scope.veeam.constants.ENABLED;
  };

  $scope.loadVeeam();
});
