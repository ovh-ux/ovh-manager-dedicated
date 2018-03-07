angular.module("Billing.controllers").controller("HostingTerminateCtrl", [
    "$scope",
    "$log",
    "constants",
    "BillingAutoRenew",
    "Alerter",
    "AUTORENEW_EVENT",
    function ($scope, $log, constants, AutoRenew, Alerter, AUTORENEW_EVENT) {
        "use strict";

        $scope.hosting = $scope.currentActionData[0];
        $scope.loaders = {
            loading: false
        };

        $scope.terminate = () => {
            $scope.loaders.loading = true;
            return AutoRenew.terminateHosting($scope.hosting.serviceId)
                .then(() => {
                    $scope.$emit(AUTORENEW_EVENT.TERMINATE, {
                        serviceType: "HOSTING_WEB",
                        serviceId: $scope.hosting.serviceId
                    });
                    Alerter.success($scope.tr("hosting_dashboard_close_service_success"));
                })
                .catch((err) => {
                    Alerter.alertFromSWS($scope.tr("hosting_dashboard_close_service_error"), err);
                    $log.error(err);
                })
                .finally(() => {
                    $scope.loaders.loading = false;
                    $scope.resetAction();
                });
        };
    }
]);
