angular.module("App").controller("FtpBackupCtrl", ($scope, $http, Server, Polling, Alerter, featureAvailability, $stateParams) => {
    const alert = "server_tab_ftpbackup_alert";

    $scope.ftpBackup = {
        model: null,
        use: 0
    };

    $scope.ftpBackupTable = null;
    $scope.loadingTable = false;
    $scope.loading = true;
    $scope.loadingEdit = false;
    $scope.ipbackupCurrentEdit = null;
    $scope.ipbackupCurrentEditBack = null;
    $scope.doReloadAccess = false;
    $scope.featureAvailable = true;

    $scope.disable = {
        activeFtp: false,
        deleteFtp: false,
        passwordFtp: false
    };

    // --------------LOAD------------------

    function init () {
        getTaskInProgress();

        $scope.ftpBackup.model = null;
        $scope.loading = true;
        $scope.featureAvailable = featureAvailability.hasDedicatedServerBackupStorage();

        Server.getFtpBackup($stateParams.productId)
            .then((data) => {
                if (data.activated === true) {
                    $scope.ftpBackup.model = data;
                    $scope.ftpBackup.use = data.usage ? data.usage.value * data.quota.value / 100 : 0;
                }
            })
            .finally(() => {
                $scope.loading = false;
            });
    }

    init();

    $scope.$on("server.ftpbackup.reload", init);

    // --------------TABLE ACCESS LOADING------------------

    $scope.loadFtpBackupTable = function (elementsByPage, elementsToSkip) {
        $scope.loadingTable = true;
        $scope.cancelIpBackupCurrentEdit();

        Server.getFtpBackupIp($stateParams.productId, elementsByPage, elementsToSkip)
            .then(
                (results) => {
                    $scope.ftpBackupTable = results;
                },
                (err) => {
                    if (err.code !== 404) {
                        Alerter.alertFromSWS($scope.tr("server_configuration_ftpbackup_table_fail"), err, alert);
                    }
                }
            )
            .finally(() => {
                $scope.loadingTable = false;
            });
    };

    // $scope.$on('server.ftpBackup.access.reload', function() {
    //     $scope.doReloadAccess = false;
    //     $scope.$broadcast('paginationServerSide.reload', 'backupTable');
    // });

    $scope.$on("server.ftpBackup.access.reload", () => {
        $scope.doReloadAccess = false;
        $scope.$broadcast("paginationServerSide.reload", "backupTable");
    });

    $scope.$on("server.ftpBackup.access.load", () => {
        $scope.doReloadAccess = false;
        $scope.$broadcast("paginationServerSide.loadPage", "1", "backupTable");
    });

    $scope.refreshTab = function () {
        $scope.$broadcast("server.ftpBackup.access.reload");
    };

    // --------------EDIT ACCESS------------------

    $scope.setIpBackupCurrentEdit = function (ipbackup, inputToRevert) {
        $scope.ipbackupCurrentEdit = angular.copy(ipbackup);
        $scope.ipbackupCurrentEdit[inputToRevert] = !$scope.ipbackupCurrentEdit[inputToRevert];
        $scope.ipbackupCurrentEditBack = ipbackup;
    };

    $scope.saveIpBackupCurrentEdit = function () {
        if ($scope.ipbackupCurrentEdit.cifs || $scope.ipbackupCurrentEdit.ftp || $scope.ipbackupCurrentEdit.nfs) {
            $scope.loadingEdit = true;
            Server.putFtpBackupIp($stateParams.productId, $scope.ipbackupCurrentEdit.ipBlock, $scope.ipbackupCurrentEdit.ftp, $scope.ipbackupCurrentEdit.nfs, $scope.ipbackupCurrentEdit.cifs)
                .then(
                    () => {
                        Alerter.success($scope.tr("server_configuration_ftpbackup_set_success", $scope.ipbackupCurrentEdit.ipBlock), alert);
                        $scope.refreshTab();
                        getApply();
                    },
                    (data) => {
                        Alerter.alertFromSWS($scope.tr("server_configuration_ftpbackup_set_fail", $scope.ipbackupCurrentEdit.ipBlock), data.data, alert);
                        conditionnalReloadAccess();
                    }
                )
                .finally(() => {
                    $scope.ipbackupCurrentEditBack = null;
                    $scope.ipbackupCurrentEdit = null;
                    $scope.loadingEdit = false;
                });
        }
    };

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
        Server.getTaskInProgress("createBackupFTP").then((taskTab) => {
            if (taskTab.length > 0) {
                $scope.$broadcast("dedicated.ftpbackup.active", taskTab[0]);
            }
        });
        Server.getTaskInProgress("removeBackupFTP").then((taskTab) => {
            if (taskTab.length > 0) {
                $scope.$broadcast("dedicated.ftpbackup.delete", taskTab[0]);
            }
        });
        Server.getTaskInProgress("changePasswordBackupFTP").then((taskTab) => {
            if (taskTab.length > 0) {
                $scope.$broadcast("dedicated.ftpbackup.password", taskTab[0]);
            }
        });
        getApply();
    }

    function getApply () {
        Server.getTaskInProgress("applyBackupFtpAcls").then((taskTab) => {
            angular.forEach(taskTab, (value) => {
                startFtpBackupPollRefresh(value);
            });
        });
    }

    // --------------TASK ACCESS TABLE------------------

    $scope.$on("dedicated.ftpbackup.task.refresh", (e, task) => {
        startFtpBackupPollRefresh(task);
    });

    function startFtpBackupPollRefresh (task) {
        Server.addTask($stateParams.productId, task, $scope.$id, true).then(
            (state) => {
                if (Polling.isResolve(state)) {
                    if (!$scope.ipbackupCurrentEdit) {
                        $scope.$broadcast("server.ftpBackup.access.reload");
                    } else {
                        $scope.doReloadAccess = true;
                    }
                } else if (!Polling.isAlreadyExist(state)) {
                    startFtpBackupPollRefresh(task);
                }
            },
            () => {
                if (!$scope.ipbackupCurrentEdit) {
                    $scope.$broadcast("server.ftpBackup.access.reload");
                } else {
                    $scope.doReloadAccess = true;
                }
            }
        );
    }

    // --------------TASK ACTIVE BACKUP------------------

    $scope.$on("dedicated.ftpbackup.active", (e, _task) => {
        $scope.disable.activeFtp = true;
        const task = _task.data;
        task.id = task.taskId;
        startFtpBackupPollActive(task);
    });

    function startFtpBackupPollActive (task) {
        Server.addTaskFast($stateParams.productId, task, $scope.$id).then(
            (state) => {
                if (Polling.isResolve(state)) {
                    Alerter.success($scope.tr("server_configuration_ftpbackup_activate_successfull"), alert);
                    $scope.disable.activeFtp = false;
                    $scope.$broadcast("server.ftpbackup.reload");
                } else {
                    startFtpBackupPollActive(task);
                }
            },
            (data) => {
                $scope.disable.activeFtp = false;
                Alerter.alertFromSWS($scope.tr("server_configuration_ftpbackup_activate_failure"), data, alert);
            }
        );
    }

    // --------------TASK DISABLE+DELETE BACKUP------------------

    $scope.$on("dedicated.ftpbackup.delete", (e, _task) => {
        $scope.disable.deleteFtp = true;
        const task = _task.data;
        task.id = task.taskId;
        startFtpBackupPollDelete(task);
    });

    function startFtpBackupPollDelete (task) {
        Server.addTaskFast($stateParams.productId, task, $scope.$id).then(
            (state) => {
                if (Polling.isResolve(state)) {
                    $scope.disable.deleteFtp = false;
                    Alerter.success($scope.tr("server_configuration_ftpbackup_delete_successfull"), alert);
                    $scope.$broadcast("server.ftpbackup.reload");
                } else {
                    startFtpBackupPollDelete(task);
                }
            },
            (data) => {
                $scope.disable.deleteFtp = false;
                Alerter.alertFromSWS($scope.tr("server_configuration_ftpbackup_delete_failure"), data, alert);
            }
        );
    }

    // --------------TASK RENEW PASSWORD BACKUP------------------

    $scope.$on("dedicated.ftpbackup.password", (e, _task) => {
        $scope.disable.passwordFtp = true;
        const task = _task.data;
        task.id = task.taskId;
        startFtpBackupPollPassword(task);
    });

    function startFtpBackupPollPassword (task) {
        Server.addTaskFast($stateParams.productId, task, $scope.$id).then(
            (state) => {
                if (Polling.isResolve(state)) {
                    $scope.disable.passwordFtp = false;
                    Alerter.success($scope.tr("server_configuration_ftpbackup_lost_password_successfull"), alert);
                } else {
                    startFtpBackupPollPassword(task);
                }
            },
            (data) => {
                $scope.disable.passwordFtp = false;
                Alerter.alertFromSWS($scope.tr("server_configuration_ftpbackup_lost_password_failure"), data, alert);
            }
        );
    }
});
