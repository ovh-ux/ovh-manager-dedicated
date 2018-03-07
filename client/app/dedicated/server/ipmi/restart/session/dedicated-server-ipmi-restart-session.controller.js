angular.module("App").controller("ServerIpmiRestartSessionsCtrl", ($scope, $stateParams, Server, Alerter) => {
    $scope.loading = false;
    $scope.alert = "server_tab_ipmi_alert";

    $scope.ipmiSessions = function () {
        $scope.loading = true;
        Server.ipmiSessionsReset($stateParams.productId).then(
            () => {
                $scope.resetAction();
                $scope.loading = false;
                Alerter.alertFromSWS($scope.tr("server_configuration_impi_sessions_loading"), null, $scope.alert);
            },
            (data) => {
                $scope.resetAction();
                $scope.loading = false;
                Alerter.alertFromSWS($scope.tr("server_configuration_impi_sessions_error"), data.data, $scope.alert);
            }
        );
    };
});
