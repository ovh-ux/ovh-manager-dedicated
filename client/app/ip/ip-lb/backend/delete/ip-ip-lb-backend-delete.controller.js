angular.module("Module.ip.controllers").controller("IplbBackendDeleteCtrl", [
    "$scope",
    "$rootScope",
    "Iplb",
    "Alerter",

    function ($scope, $rootScope, Iplb, Alerter) {
        "use strict";

        $scope.data = $scope.currentActionData; // service

        $scope.loading = false;

        /* Action */

        $scope.deleteBackend = function () {
            $scope.loading = true;
            Iplb.deleteBackend($scope.data.selectedIplb.value, $scope.data.backend.backend)
                .then(
                    (task) => {
                        Iplb.polldelBackend({
                            serviceName: $scope.data.selectedIplb.value,
                            taskId: task.id,
                            taskFunction: task.action
                        });
                    },
                    (reason) => {
                        Alerter.alertFromSWS($scope.tr("iplb_backend_delBackend_failure"), reason);
                    }
                )
                .finally(() => {
                    $scope.resetAction();
                });
        };
    }
]);
