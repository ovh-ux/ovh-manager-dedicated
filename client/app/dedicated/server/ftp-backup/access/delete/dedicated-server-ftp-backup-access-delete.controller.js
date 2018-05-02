angular.module("App").controller("DeleteAccessFtpBackupCtrl", ($scope, Server, $rootScope, $translate, Alerter, $stateParams) => {
    const alert = "server_tab_ftpbackup_alert";

    $scope.access = $scope.currentActionData.ipBlock;
    $scope.loading = false;

    $scope.deleteAccessFtpBackup = function () {
        $scope.loading = true;

        Server.deleteFtpBackupIp($stateParams.productId, $scope.access)
            .then(
                () => {
                    $rootScope.$broadcast("server.ftpBackup.access.load");
                    Alerter.success($translate.instant("server_configuration_ftpbackup_access_delete_success", { t0: $scope.access }), alert);
                },
                (data) => {
                    Alerter.alertFromSWS($translate.instant("server_configuration_ftpbackup_access_delete_failure", { t0: $scope.access }), data.data, alert);
                }
            )
            .finally(() => {
                $scope.resetAction();
                $scope.loading = false;
            });
    };
});
