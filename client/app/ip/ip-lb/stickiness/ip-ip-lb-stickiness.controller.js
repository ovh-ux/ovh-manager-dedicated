angular.module("Module.ip.controllers").controller("IplbSetStickinessCtrl", [
    "$scope",
    "$rootScope",
    "Iplb",
    "Alerter",

    function ($scope, $rootScope, Iplb, Alerter) {
        "use strict";

        $scope.data = $scope.currentActionData; // service
        $scope.model = {
            choice: $scope.data.infos.stickiness
        };

        $scope.loading = false;

        /* Action */

        $scope.setStickiness = function () {
            $scope.loading = true;
            Iplb.setStickiness($scope.data.value, $scope.model.choice)
                .then(
                    () => {
                        Alerter.success($scope.tr("iplb_stickiness_set_success"));
                    },
                    (reason) => {
                        Alerter.alertFromSWS($scope.tr("iplb_stickiness_set_failure"), reason);
                    }
                )
                .finally(() => {
                    $scope.resetAction();
                });
        };
    }
]);
