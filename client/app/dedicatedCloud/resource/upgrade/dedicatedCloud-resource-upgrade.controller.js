angular.module("App").controller("DedicatedCloudUpgradeCtrl", ($scope, $stateParams, DedicatedCloud) => {
    "use strict";

    $scope.upgrade = function () {
        $scope.resetAction();
        DedicatedCloud.upgrade($stateParams.productId).then(
            () => {
                $scope.setMessage($scope.tr("dedicatedCloud_upgrade_success"));
            },
            (data) => {
                $scope.setMessage($scope.tr("dedicatedCloud_upgrade_error"), data.data);
            }
        );
    };
});
