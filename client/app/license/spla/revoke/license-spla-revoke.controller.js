angular.module("Module.license.controllers").controller("LicenseSplaRevokeCtrl", [
    "$scope",
    "License",
    "Alerter",
    "$rootScope",
    "$location",
    "$timeout",

    function ($scope, License, Alerter, $rootScope, $location, $timeout) {
        "use strict";

        $scope.model = {
            license: $scope.currentActionData.license,
            deleting: false,
            deleted: false
        };

        $scope.revokeSpla = () => {
            if (!$scope.model.deleting && !$scope.model.deleted) {
                $scope.model.deleting = true;
                $scope.model.deleted = false;
                License.splaRevoke($scope.model.license.serverServiceName, $scope.model.license.id).then(
                    () => {
                        $scope.model.deleting = false;
                        $scope.model.deleted = true;
                        $timeout(() => {
                            $scope.resetAction();
                            $timeout(() => {
                                $location.path("/configuration/license");
                            }, 800);
                        }, 1500);
                    },
                    (err) => {
                        $scope.resetAction();
                        Alerter.alertFromSWS($scope.tr("license_spla_revoke_fail"), err.data);
                    }
                );
            }
        };
    }
]);
