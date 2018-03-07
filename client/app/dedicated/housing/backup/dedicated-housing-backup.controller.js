angular.module("App").controller("HousingFtpBackupCtrl", ($scope, $http, $stateParams, Polling, Alerter, Housing) => {
    "use strict";

    const alert = "housing_tab_ftpbackup_alert";
    const serviceName = $stateParams.productId;

    $scope.ftpBackup = {
        model: null,
        use: 0
    };
    $scope.ftpBackupTable = null;
    $scope.loaders = {
        table: false,
        global: true,
        edit: false
    };
    $scope.ipbackupCurrentEdit = null;
    $scope.ipbackupCurrentEditBack = null;
    $scope.doReloadAccess = false;
    $scope.backupIps = [];
    $scope.disable = {
        activeFtp: false,
        deleteFtp: false,
        passwordFtp: false
    };

    // --------------LOAD------------------

    function init () {
        getTaskInProgress();

        $scope.ftpBackup.model = null;
        $scope.loaders.global = true;
        $scope.loaders.table = true;
        $scope.reloadIpsBackup = !$scope.reloadIpsBackup;

        loadFtpBackupIps();

        Housing.getFtpBackup($stateParams.productId)
            .then((data) => {
                $scope.ftpBackup.model = data;
                $scope.ftpBackup.use = data.quota.usage;
                $scope.ftpBackup.usage = data.quota.usage / data.quota.value * 100;
                $scope.ftpBackup.model.login = serviceName;
            })
            .finally(() => {
                $scope.loaders.global = false;
            });
    }

    init();

    $scope.transformItem = function (id) {
        return Housing.getFtpBackupIpDetail($stateParams.productId, id);
    };

    $scope.onTransformItemDone = function () {
        $scope.loaders.table = false;
    };

    // --------------TABLE ACCESS LOADING------------------

    function loadFtpBackupIps () {
        return Housing.getFtpBackupIps($stateParams.productId).then((ips) => {
            if (ips.length === 0) {
                $scope.loaders.table = false;
            }

            $scope.backupIps = ips;
            $scope.reloadIps = !$scope.reloadIps;
        });
    }

    $scope.reloadIpsBackup = function () {
        $scope.loaders.table = true;
        loadFtpBackupIps();
    };

    // --------------EDIT ACCESS------------------

    $scope.setIpBackupCurrentEdit = function (ipbackup, _inputToRevert) {
        let inputToRevert = _inputToRevert;
        $scope.ipbackupCurrentEdit = angular.copy(ipbackup);
        $scope.ipbackupCurrentEdit[inputToRevert] = !$scope.ipbackupCurrentEdit[inputToRevert];
        $scope.ipbackupCurrentEditBack = ipbackup;
        inputToRevert = !inputToRevert;
    };

    $scope.saveIpBackupCurrentEdit = function () {
        if ($scope.ipbackupCurrentEdit.cifs || $scope.ipbackupCurrentEdit.ftp || $scope.ipbackupCurrentEdit.nfs) {
            $scope.loaders.edit = true;
            Housing.putFtpBackupIp($stateParams.productId, $scope.ipbackupCurrentEdit.ipBlock, $scope.ipbackupCurrentEdit.ftp, $scope.ipbackupCurrentEdit.nfs, $scope.ipbackupCurrentEdit.cifs)
                .then(
                    () => {
                        Alerter.success($scope.tr("housing_configuration_ftpbackup_set_success", $scope.ipbackupCurrentEdit.ipBlock), alert);
                        getApply();
                        startEditPolling($scope.ipbackupCurrentEdit.ipBlock);
                    },
                    (data) => {
                        Alerter.alertFromSWS($scope.tr("housing_configuration_ftpbackup_set_fail", $scope.ipbackupCurrentEdit.ipBlock), data, alert);
                        conditionnalReloadAccess();
                    }
                )
                .finally(() => {
                    $scope.ipbackupCurrentEditBack = null;
                    $scope.ipbackupCurrentEdit = null;
                    $scope.loaders.edit = false;
                });
        }
    };

    function startEditPolling (ipBlock) {
        return Housing.getFtpBackupIpDetail($stateParams.productId, ipBlock).then((backup) => {
            if (!backup.isApplied) {
                setTimeout(() => {
                    startEditPolling(ipBlock);
                }, 5000);
            } else {
                $scope.reloadIpsBackup();
            }
        });
    }

    $scope.cancelIpBackupCurrentEdit = function () {
        $scope.ipbackupCurrentEdit = null;
        $scope.ipbackupCurrentEditBack = null;
        conditionnalReloadAccess();
    };

    function conditionnalReloadAccess () {
        if ($scope.doReloadAccess) {
            $scope.doReloadAccess = false;
            $scope.refreshTab();
        }
    }

    // --------------TASK POLLING------------------

    $scope.$on("$destroy", () => {
        Polling.addKilledScope($scope.$id);
    });

    function getTaskInProgress () {
        Housing.getTaskInProgress($stateParams.productId, "createBackupFTP").then((taskTab) => {
            if (taskTab.length > 0) {
                $scope.$broadcast("housing.ftpbackup.active", taskTab[0].data);
            }
        });
        Housing.getTaskInProgress($stateParams.productId, "removeBackupFTP").then((taskTab) => {
            if (taskTab.length > 0) {
                $scope.$broadcast("housing.ftpbackup.delete", taskTab[0].data);
            }
        });
        Housing.getTaskInProgress($stateParams.productId, "changePasswordBackupFTP").then((taskTab) => {
            if (taskTab.length > 0) {
                $scope.$broadcast("housing.ftpbackup.password", taskTab[0].data);
            }
        });
        getApply();
    }

    function getApply () {
        Housing.getTaskInProgress($stateParams.productId, "applyBackupFtpAcls").then((taskTab) => {
            angular.forEach(taskTab, (value) => {
                startFtpBackupPollRefresh(value);
            });
        });
    }

    // --------------TASK ACCESS TABLE------------------

    $scope.$on("housing.ftpbackup.task.refresh", (e, task) => {
        startFtpBackupPollRefresh(task);
    });

    function startFtpBackupPollRefresh (task) {
        task.id = task.taskId;
        Housing.addTask($stateParams.productId, task, $scope.$id, true).then(
            (state) => {
                if (Polling.isResolve(state)) {
                    if (!$scope.ipbackupCurrentEdit) {
                        $scope.$broadcast("housing.ftpBackup.access.reload");
                    } else {
                        $scope.doReloadAccess = true;
                    }
                } else {
                    startFtpBackupPollRefresh(task);
                }
            },
            () => {
                if (!$scope.ipbackupCurrentEdit) {
                    $scope.$broadcast("housing.ftpBackup.access.reload");
                } else {
                    $scope.doReloadAccess = true;
                }
            }
        );
    }

    // --------------TASK ACTIVE BACKUP------------------

    $scope.$on("housing.ftpbackup.active", (e, task) => {
        $scope.disable.activeFtp = true;
        startFtpBackupPollActive(task);
    });

    function startFtpBackupPollActive (task) {
        task.id = task.taskId;
        Housing.addTaskFast($stateParams.productId, task, $scope.$id).then(
            (state) => {
                if (Polling.isResolve(state)) {
                    Alerter.success($scope.tr("housing_configuration_ftpbackup_activate_successfull"), alert);
                    $scope.disable.activeFtp = false;
                    $scope.$broadcast("housing.ftpbackup.reload");
                } else {
                    startFtpBackupPollActive(task);
                }
            },
            (data) => {
                $scope.disable.activeFtp = false;
                Alerter.alertFromSWS($scope.tr("housing_configuration_ftpbackup_activate_failure"), data, alert);
            }
        );
    }

    // --------------TASK DISABLE+DELETE BACKUP------------------

    $scope.$on("housing.ftpbackup.delete", (e, task) => {
        $scope.disable.deleteFtp = true;
        startFtpBackupPollDelete(task);
    });

    function startFtpBackupPollDelete (task) {
        Housing.addTaskFast($stateParams.productId, task, $scope.$id).then(
            (state) => {
                if (Polling.isResolve(state)) {
                    $scope.disable.deleteFtp = false;
                    Alerter.success($scope.tr("housing_configuration_ftpbackup_delete_successfull"), alert);
                    $scope.$broadcast("housing.ftpbackup.reload");
                } else {
                    startFtpBackupPollDelete(task);
                }
            },
            (data) => {
                $scope.disable.deleteFtp = false;
                Alerter.alertFromSWS($scope.tr("housing_configuration_ftpbackup_delete_failure"), data, alert);
            }
        );
    }

    // --------------TASK RENEW PASSWORD BACKUP------------------

    $scope.$on("housing.ftpbackup.password", (e, task) => {
        $scope.disable.passwordFtp = true;
        startFtpBackupPollPassword(task);
    });

    function startFtpBackupPollPassword (task) {
        Housing.addTaskFast($stateParams.productId, task, $scope.$id).then(
            (state) => {
                if (Polling.isResolve(state)) {
                    $scope.disable.passwordFtp = false;
                    Alerter.success($scope.tr("housing_configuration_ftpbackup_lost_password_successfull"), alert);
                } else {
                    startFtpBackupPollPassword(task);
                }
            },
            () => {
                $scope.disable.passwordFtp = false;
            }
        );
    }

    $scope.$on("housing.ftpbackup.reload", init);
    $scope.$on("housing.ftpbackup.refresh", $scope.reloadIpsBackup);
    $scope.$on("housing.ftpBackup.access.reload", init);
    $scope.$on("housing.ftpBackup.access.load", $scope.reloadIpsBackup);
});
