angular.module("App").controller("DedicatedCloudUserDeleteCtrl", ($scope, $stateParams, DedicatedCloud) => {
    "use strict";

    $scope.user = $scope.currentActionData;
    $scope.deleteUser = function () {
        $scope.resetAction();
        DedicatedCloud.deleteUser($stateParams.productId, $scope.user.userId).then(
            () => {
                $scope.setMessage($scope.tr("dedicatedCloud_USER_delete_success", $scope.user.name));
            },
            (data) => {
                $scope.setMessage($scope.tr("dedicatedCloud_USER_delete_fail", $scope.user.name), {
                    type: "ERROR",
                    message: data.message
                });
            }
        );
    };
});
