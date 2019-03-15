angular
  .module('App')
  .controller('DedicatedCloudUserEnableCtrl', ($scope, $stateParams, $translate, DedicatedCloud) => {
    $scope.user = $scope.currentActionData;

    $scope.enableUser = function () {
      DedicatedCloud.enableUser($stateParams.productId, $scope.user.userId)
        .then(
          () => {
          // Start Polling
          },
          (err) => {
            $scope.setMessage($translate.instant('dedicatedCloud_USER_enable_fail', { t0: $scope.user.name }), { message: err.data, type: 'ERROR' });
          },
        )
        .finally(() => {
          $scope.resetAction();
        });
    };
  });
