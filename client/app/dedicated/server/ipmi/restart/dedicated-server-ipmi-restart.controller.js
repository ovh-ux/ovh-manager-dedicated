angular.module("App").controller("ServerIpmiRestartCtrl", ($scope, $stateParams, Server, Alerter) => {
    $scope.loading = false;
    $scope.alert = "server_tab_ipmi_alert";

    $scope.restartIpmi = function () {
        $scope.loading = true;
        Server.ipmiRestart($stateParams.productId).then(
            () => {
                $scope.resetAction();
                $scope.loading = false;
                Alerter.alertFromSWS($scope.tr("server_configuration_impi_restart_loading"), true, $scope.alert);
            },
            (data) => {
                $scope.resetAction();
                $scope.loading = false;
                Alerter.alertFromSWS($scope.tr("server_configuration_impi_restart_error"), data, $scope.alert);
            }
        );
    };
});
