angular.module("App").controller("AddAccessFtpBackupCtrl", ($scope, $translate, Server, $rootScope, Alerter, $stateParams) => {
    const alert = "server_tab_ftpbackup_alert";

    $scope.access = {
        listIp: [],
        ip: null,
        ftp: false,
        cifs: false,
        nfs: false
    };
    $scope.loading = false;

    $scope.load = function () {
        $scope.loading = true;
        Server.getAuthorizableBlocks($stateParams.productId).then(
            (list) => {
                $scope.access.listIp = list;
                $scope.loading = false;
            },
            (data) => {
                $scope.resetAction();
                $scope.loading = false;
                Alerter.alertFromSWS($translate.instant("server_configuration_ftpbackup_access_add_ip_failure"), data.data, alert);
            }
        );
    };

    $scope.addFtpBackup = function () {
        const resultMessages = {
            OK: $translate.instant("server_configuration_ftpbackup_access_add_success"),
            PARTIAL: $translate.instant("server_configuration_ftpbackup_access_add_partial"),
            ERROR: $translate.instant("server_configuration_ftpbackup_access_add_failure")
        };

        $scope.loading = true;

        Server.postFtpBackupIp($stateParams.productId, $scope.access.ip, $scope.access.ftp, $scope.access.nfs, $scope.access.cifs)
            .then(
                (data) => {
                    angular.forEach(data.results, (task) => {
                        $rootScope.$broadcast("dedicated.ftpbackup.task.refresh", task);
                    });
                    $rootScope.$broadcast("server.ftpBackup.access.load");
                    Alerter.alertFromSWSBatchResult(resultMessages, data, alert);
                },
                (data) => {
                    Alerter.alertFromSWSBatchResult(resultMessages, data, alert);
                }
            )
            .finally(() => {
                $scope.resetAction();
                $scope.loading = false;
            });
    };
});
