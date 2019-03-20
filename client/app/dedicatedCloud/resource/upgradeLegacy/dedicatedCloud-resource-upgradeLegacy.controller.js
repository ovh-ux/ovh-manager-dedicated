angular.module('App').controller('DedicatedCloudUpgradeCtrl', ($scope, $stateParams, $translate, DedicatedCloud) => {
  $scope.upgrade = function () {
    $scope.resetAction();
    DedicatedCloud.upgrade($stateParams.productId).then(
      () => {
        $scope.setMessage($translate.instant('dedicatedCloud_upgrade_success'));
      },
      (data) => {
        $scope.setMessage($translate.instant('dedicatedCloud_upgrade_error'), data.data);
      },
    );
  };
});
