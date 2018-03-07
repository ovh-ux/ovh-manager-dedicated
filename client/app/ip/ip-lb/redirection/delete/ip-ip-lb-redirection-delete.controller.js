angular.module("Module.ip.controllers").controller("IplbPortsRedirectionDeleteCtrl", [
    "$scope",
    "$rootScope",
    "Iplb",
    "Alerter",
    "$stateParams",

    function ($scope, $rootScope, Iplb, Alerter, $stateParams) {
        "use strict";

        $scope.data = $scope.currentActionData; // service

        $scope.loading = false;

        /* Action */

        $scope.deletePortsRedirection = function () {
            $scope.loading = true;
            Iplb.deletePortsRedirection($scope.data.selectedIplb.value, $scope.data.srcPort)
                .then(
                    (task) => {
                        Iplb.pollPortList({
                            serviceName: $stateParams.serviceName,
                            taskId: task.id,
                            taskFunction: task.action
                        });
                        Alerter.success($scope.tr("iplb_portsredirection_delete_success"));
                    },
                    (reason) => {
                        Alerter.alertFromSWS($scope.tr("iplb_portsredirection_delete_failure"), reason);
                    }
                )
                .finally(() => {
                    $scope.resetAction();
                });
        };
    }
]);
