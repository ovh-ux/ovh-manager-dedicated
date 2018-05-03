angular.module("App").controller("DedicatedCloudUserDisableCtrl", ($scope, $stateParams, $translate, DedicatedCloud) => {
    "use strict";

    $scope.user = $scope.currentActionData;
    $scope.disableUser = function () {
        $scope.resetAction();
        DedicatedCloud.disableUser($stateParams.productId, $scope.user.userId).then(
            () => {
                $scope.setMessage($translate.instant("dedicatedCloud_USER_disable_success", { t0: $scope.user.name }));
            },
            (err) => {
                $scope.setMessage($translate.instant("dedicatedCloud_USER_disable_fail", { t0: $scope.user.name }), err.data);
            }
        );
    };
});
