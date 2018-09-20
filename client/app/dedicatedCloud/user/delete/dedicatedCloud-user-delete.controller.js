angular.module('App').controller('DedicatedCloudUserDeleteCtrl', ($scope, $stateParams, $translate, DedicatedCloud) => {
  $scope.user = $scope.currentActionData;
  $scope.deleteUser = function () {
    $scope.resetAction();
    DedicatedCloud.deleteUser($stateParams.productId, $scope.user.userId).then(
      () => {
        $scope.setMessage($translate.instant('dedicatedCloud_USER_delete_success', { t0: $scope.user.name }));
      },
      (data) => {
        $scope.setMessage($translate.instant('dedicatedCloud_USER_delete_fail', { t0: $scope.user.name }), {
          type: 'ERROR',
          message: data.message,
        });
      },
    );
  };
});
