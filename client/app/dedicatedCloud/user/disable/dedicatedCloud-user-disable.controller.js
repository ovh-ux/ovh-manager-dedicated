angular.module("App").controller("DedicatedCloudUserDisableCtrl", ($scope, $stateParams, DedicatedCloud) => {
    "use strict";

    $scope.user = $scope.currentActionData;
    $scope.disableUser = function () {
        $scope.resetAction();
        DedicatedCloud.disableUser($stateParams.productId, $scope.user.userId).then(
            () => {
                $scope.setMessage($scope.tr("dedicatedCloud_USER_disable_success", $scope.user.name));
            },
            (err) => {
                $scope.setMessage($scope.tr("dedicatedCloud_USER_disable_fail", $scope.user.name), err.data);
            }
        );
    };
});
