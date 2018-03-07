angular.module("Module.ip.controllers").controller("IpDeleteIpBlockCtrl", [
    "$scope",
    "$rootScope",
    "Ip",
    "Alerter",

    function ($scope, $rootScope, Ip, Alerter) {
        "use strict";

        $scope.data = $scope.currentActionData;

        $scope.loading = false;

        $scope.deleteIpBlock = function () {
            $scope.loading = true;
            Ip.deleteIpBlock($scope.data.ipBlock.ipBlock)
                .then(
                    (data) => {
                        Alerter.alertFromSWS($scope.tr("ip_table_manage_delete_ipblock_success"), data);
                    },
                    (reason) => {
                        Alerter.alertFromSWS($scope.tr("ip_table_manage_delete_ipblock_failure", [$scope.data.ipBlock.ipBlock]), reason);
                    }
                )
                .finally(() => {
                    $scope.resetAction();
                });
        };
    }
]);
