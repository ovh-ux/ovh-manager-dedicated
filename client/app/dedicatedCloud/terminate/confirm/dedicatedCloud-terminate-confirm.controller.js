angular.module("App").controller("DedicatedCloudConfirmTerminateCtrl", ($scope, $stateParams, $location, DedicatedCloud, Alerter) => {
    "use strict";

    $scope.form = {};
    $scope.loaders = {
        loading: false
    };

    $scope.reasons = ["LACK_OF_PERFORMANCES", "TOO_EXPENSIVE", "TOO_HARD_TO_USE", "NOT_RELIABLE", "NOT_NEEDED_ANYMORE", "MIGRATED_TO_COMPETITOR", "MIGRATED_TO_ANOTHER_OVH_PRODUCT", "OTHER"];

    $scope.confirm = function () {
        $scope.loaders.loading = true;
        DedicatedCloud.confirmTerminate($stateParams.productId, $scope.form.reason, $stateParams.token, $scope.form.commentary)
            .then(() => {
                Alerter.success($scope.tr("dedicatedCloud_confirm_close_success"), $scope.alerts.dashboard);
            })
            .catch((err) => {
                Alerter.alertFromSWS($scope.tr("dedicatedCloud_confirm_close_error"), err.data, $scope.alerts.dashboard);
            })
            .finally(() => {
                $scope.loaders.loading = false;
                $location.search("action", null);
                $scope.resetAction();
            });
    };

    $scope.cancel = function () {
        $location.search("action", null);
        $scope.resetAction();
    };
});
