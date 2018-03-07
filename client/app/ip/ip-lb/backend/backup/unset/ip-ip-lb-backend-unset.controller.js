angular.module("Module.ip.controllers").controller("IplbBackendUnsetBackupStateCtrl", [
    "$scope",
    "$rootScope",
    "Iplb",
    "Alerter",

    function ($scope, $rootScope, Iplb, Alerter) {
        "use strict";

        $scope.data = $scope.currentActionData; // service

        $scope.model = {
            backupStateSet: false
        };

        $scope.loading = false;

        /* Action */

        $scope.unsetBackupState = function () {
            $scope.loading = true;
            Iplb.setBackupState($scope.data.selectedIplb.value, $scope.data.backend.backend, $scope.model)
                .then(
                    (task) => {
                        Iplb.polldelBackend({
                            serviceName: $scope.data.selectedIplb.value,
                            taskId: task.id,
                            taskFunction: task.action
                        });
                    },
                    (reason) => {
                        Alerter.alertFromSWS($scope.tr("iplb_backend_backupStateUnset_failure"), reason);
                    }
                )
                .finally(() => {
                    $scope.resetAction();
                });
        };
    }
]);
