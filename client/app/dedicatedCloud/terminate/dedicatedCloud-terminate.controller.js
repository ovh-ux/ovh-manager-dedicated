angular.module("App").controller("DedicatedCloudTerminateCtrl", ($scope, $stateParams, $translate, constants, DedicatedCloud, Alerter) => {
    "use strict";

    $scope.hosting = $scope.currentActionData;
    $scope.loaders = {
        loading: false
    };

    $scope.terminate = function () {
        $scope.loaders.loading = true;
        DedicatedCloud.terminate($stateParams.productId)
            .then(
                () => {
                    Alerter.success($translate.instant("dedicatedCloud_close_service_success"), $scope.alerts.dashboard);
                },
                (err) => {
                    Alerter.alertFromSWS($translate.instant("dedicatedCloud_close_service_error"), err, $scope.alerts.dashboard);
                }
            )
            .finally(() => {
                $scope.loaders.loading = false;
                $scope.resetAction();
            });
    };
});
