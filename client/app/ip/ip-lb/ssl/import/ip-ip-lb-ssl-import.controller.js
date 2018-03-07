angular.module("Module.ip.controllers").controller("IplbImportCustomSslCtrl", [
    "$scope",
    "$rootScope",
    "Iplb",
    "Alerter",

    function ($scope, $rootScope, Iplb, Alerter) {
        "use strict";

        $scope.data = $scope.currentActionData; // service
        $scope.model = {};

        $scope.loading = false;

        /* Action */

        $scope.importCustomSsl = function () {
            $scope.loading = true;
            Iplb.importCustomSsl($scope.data.value, $scope.model)
                .then(
                    () => {
                        Alerter.success($scope.tr("iplb_ssl_import_success"));
                    },
                    (reason) => {
                        Alerter.alertFromSWS($scope.tr("iplb_ssl_import_failure"), reason);
                    }
                )
                .finally(() => {
                    $scope.resetAction();
                });
        };
    }
]);
