angular.module("App").controller("DeleteAccessFtpBackupCtrl", ($scope, Server, $rootScope, Alerter, $stateParams) => {
    const alert = "server_tab_ftpbackup_alert";

    $scope.access = $scope.currentActionData.ipBlock;
    $scope.loading = false;

    $scope.deleteAccessFtpBackup = function () {
        $scope.loading = true;

        Server.deleteFtpBackupIp($stateParams.productId, $scope.access)
            .then(
                () => {
                    $rootScope.$broadcast("server.ftpBackup.access.load");
                    Alerter.success($scope.tr("server_configuration_ftpbackup_access_delete_success", $scope.access), alert);
                },
                (data) => {
                    Alerter.alertFromSWS($scope.tr("server_configuration_ftpbackup_access_delete_failure", $scope.access), data.data, alert);
                }
            )
            .finally(() => {
                $scope.resetAction();
                $scope.loading = false;
            });
    };
});
