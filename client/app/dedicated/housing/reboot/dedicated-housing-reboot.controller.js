angular.module("App").controller("HousingRebootCtrl", ($scope, $stateParams, Housing, Alerter) => {
    $scope.getRebootPrices = function () {
        $scope.loading = true;
        Housing.getRebootPrices($stateParams.productId)
            .then(
                (contract) => {
                    $scope.contract = contract;
                },
                (err) => {
                    Alerter.alertFromSWS($scope.tr("housing_configuration_reboot_fail_apcinfo"), err, "housing_tab_reboot_alert");
                }
            )
            .finally(() => {
                $scope.loading = false;
            });
    };

    $scope.reboot = function () {
        $scope.loading = true;
        Housing.rebootOrder($stateParams.productId)
            .then(
                (order) => {
                    Alerter.success($scope.tr("housing_configuration_reboot_success", "housing_dashboard_alert"));
                    window.open(order.url, "_blank").focus();
                },
                (err) => {
                    Alerter.alertFromSWS($scope.tr("housing_configuration_reboot_fail"), err, "housing_dashboard_alert");
                }
            )
            .finally(() => {
                $scope.resetAction();
                $scope.loading = false;
            });
    };
});
