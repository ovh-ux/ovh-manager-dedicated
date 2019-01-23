angular.module('App').controller('DedicatedCloudUserDisableCtrl', ($scope, $stateParams, $translate, DedicatedCloud) => {
  $scope.user = $scope.currentActionData;
  $scope.disableUser = function disableUser() {
    $scope.resetAction();
    DedicatedCloud
      .disableUser($stateParams.productId, $scope.user.userId)
      .then(() => {
        $scope.setMessage($translate.instant('dedicatedCloud_USER_disable_success', { t0: $scope.user.name }));
      })
      .catch((err) => {
        $scope.setMessage(
          $translate.instant('dedicatedCloud_USER_disable_fail', { t0: $scope.user.name }),
          {
            ...err,
            type: 'error',
          },
        );
      });
  };
});
