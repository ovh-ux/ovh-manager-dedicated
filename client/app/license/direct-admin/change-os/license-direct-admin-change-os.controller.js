angular.module("Module.license.controllers").controller("LicenseDirectAdminChangeOsCtrl", [
    "$scope",
    "$q",
    "License",
    "Alerter",

    function ($scope, $q, License, Alerter) {
        "use strict";

        $scope.model = {
            license: $scope.currentActionData.license,
            modifying: false,
            availableOs: undefined,
            selectedOs: undefined,
            loading: true,
            operationIsPending: false,
            currentOs: undefined
        };

        function getDirectAdminModels () {
            return License.getDirectAdminModels().then((models) => models.models["license.DirectAdminOsEnum"].enum);
        }

        function getLicenseOs () {
            return License.getLicence($scope.model.license.id, $scope.model.license.type).then((license) => license.os);
        }

        function isTaskPending () {
            return License.tasks($scope.model.license, "changeOs").then((tasks) => tasks && tasks.length > 0);
        }

        function init () {
            $q
                .all({
                    isTaskPending: isTaskPending(),
                    os: getLicenseOs(),
                    allOs: getDirectAdminModels()
                })
                .then((result) => {
                    $scope.model.operationIsPending = false; // TODO result.isTaskPending;
                    $scope.model.currentOs = result.os;
                    $scope.model.selectedOs = result.os;
                    $scope.model.availableOs = result.allOs;
                })
                .catch((err) => {
                    $scope.exit(true);
                    Alerter.alertFromSWS($scope.tr("license_directadmin_changeOs_loading_error"), err.data);
                })
                .finally(() => {
                    $scope.model.loading = false;
                });
        }

        $scope.changeOs = function () {
            if ($scope.model.selectedOs && !$scope.model.modifying) {
                $scope.model.modifying = true;
                License.changeOs($scope.model.license, $scope.model.selectedOs)
                    .then(() => {
                        Alerter.success($scope.tr("license_directadmin_changeOs_success"));
                    })
                    .catch((err) => {
                        Alerter.alertFromSWS($scope.tr("license_directadmin_changeOs_fail"), err.message);
                    })
                    .finally(() => {
                        $scope.exit(true);
                    });
            } else {
                $scope.resetAction();
            }
        };

        $scope.isValid = function () {
            return $scope.model.selectedOs !== "" && $scope.model.selectedOs !== $scope.model.currentOs && !$scope.model.operationIsPending && !$scope.model.loading;
        };

        $scope.exit = function (osChanged) {
            if (osChanged) {
                $scope.$emit("License.Details.Refresh");
            }

            $scope.resetAction();
        };

        init();
    }
]);
