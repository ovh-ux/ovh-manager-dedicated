angular.module("Module.ip.controllers").controller("IplbBackendSetProbeCtrl", [
    "$scope",
    "$rootScope",
    "Ip",
    "Iplb",
    "Alerter",

    function ($scope, $rootScope, Ip, Iplb, Alerter) {
        "use strict";

        $scope.data = $scope.currentActionData; // service

        $scope.model = {};

        $scope.loading = true;

        Ip.getIpModels().then((models) => {
            $scope.probes = _.difference(models["ip.LoadBalancingBackendProbeEnum"].enum, [$scope.data.backend.probe]);
            $scope.loading = false;
        });

        $scope.orderByProbeAlias = function (a) {
            return $scope.i18n[`iplb_backend_probe_${a.toUpperCase()}`] || a.toUpperCase();
        };

        /* Action */

        $scope.setProbe = function () {
            $scope.loading = true;
            Iplb.putBackend($scope.data.selectedIplb.value, $scope.data.backend.backend, { probe: $scope.model.probe })
                .then(
                    () => {
                        $rootScope.$broadcast("iplb.backends.needUpdate");
                    },
                    (reason) => {
                        Alerter.alertFromSWS($scope.tr("iplb_backend_setprobe_failure"), reason);
                    }
                )
                .finally(() => {
                    $scope.resetAction();
                });
        };
    }
]);
