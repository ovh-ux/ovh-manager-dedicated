angular.module("Module.license.controllers").controller("LicenseDeleteCtrl", ($scope, License, Alerter) => {
    $scope.model = {
        license: $scope.currentActionData.license,
        deleting: false,
        deleted: false
    };

    $scope.deleteLicense = function () {
        if (!$scope.model.deleting && !$scope.model.deleted) {
            $scope.model.deleting = true;
            License.terminate($scope.model.license.id, $scope.model.license)
                .then(
                    () => {
                        $scope.model.deleting = false;
                        $scope.model.deleted = true;
                        Alerter.success($scope.tr("license_delete_success"));
                    },
                    (err) => {
                        Alerter.alertFromSWS($scope.tr("license_delete_fail"), err.message);
                    }
                )
                .finally(() => {
                    $scope.resetAction();
                });
        } else {
            $scope.resetAction();
        }
    };
});
