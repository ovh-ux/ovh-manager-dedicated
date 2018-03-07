angular.module("App").controller("RequestFtpBackupPasswordCtrl", ($scope, $stateParams, Server, Alerter) => {
    const alert = "server_tab_ftpbackup_alert";
    $scope.ftpBackup = $scope.currentActionData;
    $scope.loading = false;

    $scope.requestFtpBackupPassword = function () {
        $scope.loading = true;

        Server.requestFtpBackupPassword($stateParams.productId)
            .then(
                () => {
                    Alerter.success($scope.tr("server_configuration_ftpbackup_lost_password_success"), alert);
                },
                (data) => {
                    Alerter.alertFromSWS($scope.tr("server_configuration_ftpbackup_lost_password_failure"), data.data, alert);
                }
            )
            .finally(() => {
                $scope.resetAction();
                $scope.loading = false;
            });
    };
});
