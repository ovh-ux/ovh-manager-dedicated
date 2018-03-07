angular.module("App").controller("DedicatedCloudUserEnableCtrl", ($scope, $stateParams, DedicatedCloud) => {
    "use strict";
    $scope.user = $scope.currentActionData;

    $scope.enableUser = function () {
        DedicatedCloud.enableUser($stateParams.productId, $scope.user.userId)
            .then(
                () => {
                    // Start Polling
                },
                (err) => {
                    $scope.setMessage($scope.tr("dedicatedCloud_USER_enable_fail", $scope.user.name), { message: err.data, type: "ERROR" });
                }
            )
            .finally(() => {
                $scope.resetAction();
            });
    };
});
