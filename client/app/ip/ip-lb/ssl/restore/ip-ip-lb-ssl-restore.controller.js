angular.module("Module.ip.controllers").controller("IplbRestoreSslCtrl", [
    "$scope",
    "$rootScope",
    "Iplb",
    "Alerter",

    function ($scope, $rootScope, Iplb, Alerter) {
        "use strict";

        $scope.data = $scope.currentActionData; // service

        $scope.loading = false;

        /* Action */

        $scope.restoreSsl = function () {
            $scope.loading = true;
            Iplb.restoreSsl($scope.data.value)
                .then(
                    () => {
                        Alerter.success($scope.tr("iplb_ssl_restore_success"));
                    },
                    (reason) => {
                        Alerter.alertFromSWS($scope.tr("iplb_ssl_restore_failure"), reason);
                    }
                )
                .finally(() => {
                    $scope.resetAction();
                });
        };
    }
]);
