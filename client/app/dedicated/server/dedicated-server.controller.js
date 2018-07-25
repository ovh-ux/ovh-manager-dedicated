angular.module("App").controller("ServerCtrl", (NO_AUTORENEW_COUNTRIES, WEATHERMAP_URL, $scope, $timeout, $stateParams, $translate, Server, Polling, $q, constants, User, ovhUserPref, featureAvailability) => {
    "use strict";

    const errorStatus = ["customer_error", "ovh_error", "error", "cancelled"];

    $scope.loadingServerInformations = true;
    $scope.loadingServerError = false;
    $scope.featureAvailability = featureAvailability;
    $scope.server = {
        isExpired: true
    };

    $scope.loaders = {
        autoRenew: true
    };

    $scope.disable = {
        reboot: false,
        byOtherTask: false,
        install: false,
        installationInProgress: false,
        installationInProgressError: false,
        noDeleteMessage: false
    };
    $scope.urlRenew = null;
    $scope.worldPart = constants.target;

    $scope.bigModalDialog = false;

    $scope.newDisplayName = {
        value: ""
    };

    $scope.autoRenew = null;
    $scope.autoRenewStopBother = true;
    $scope.autoRenewable = false;
    $scope.autoRenewGuide = null;
    $scope.hasPaymentMean = false;

    $scope.housingPhoneStopBother = true;
    $scope.housingPhoneNumber = constants.urls.FR.housingPhoneSupport;
    $scope.isHousing = false;

    $scope.setToBigModalDialog = (active) => {
        $scope.mediumModalDialog = false;
        $scope.bigModalDialog = active;
    };

    $scope.resetAction = () => {
        $scope.setAction(false);
        $scope.setToBigModalDialog(false);
    };

    $scope.$on("$locationChangeStart", () => {
        $scope.resetAction();
    });

    $scope.setMessage = (message, data) => {
        let messageToSend = message;
        let i = 0;
        $scope.alertType = "";
        if (data) {
            if (data.message) {
                messageToSend += ` (${data.message})`;
                switch (data.type) {
                case "ERROR":
                    $scope.alertType = "alert-danger";
                    break;
                case "WARNING":
                    $scope.alertType = "alert-warning";
                    break;
                case "INFO":
                    $scope.alertType = "alert-success";
                    break;
                default:
                    break;
                }
            } else if (data.messages) {
                if (data.messages.length > 0) {
                    switch (data.state) {
                    case "ERROR":
                        $scope.alertType = "alert-danger";
                        break;
                    case "PARTIAL":
                        $scope.alertType = "alert-warning";
                        break;
                    case "OK":
                        $scope.alertType = "alert-success";
                        break;
                    default:
                        break;
                    }
                    messageToSend += " (";
                    for (i; i < data.messages.length; i++) {
                        messageToSend += `${data.messages[i].id} : ${data.messages[i].message}${data.messages.length === i + 1 ? ")" : ", "}`;
                    }
                }
            } else if (data.idTask && data.state) {
                switch (data.state) {
                case "BLOCKED":
                case "blocked":
                case "CANCELLED":
                case "cancelled":
                case "PAUSED":
                case "paused":
                case "ERROR":
                case "error":
                    $scope.alertType = "alert-danger";
                    break;
                case "WAITING_ACK":
                case "waitingAck":
                case "DOING":
                case "doing":
                    $scope.alertType = "alert-warning";
                    break;
                case "TODO":
                case "todo":
                case "DONE":
                case "done":
                    $scope.alertType = "alert-success";
                    break;
                default:
                    break;
                }
            } else if (data === "true" || data === true) {
                $scope.alertType = "alert-success";
            } else if (data.type) {
                switch (data.type) {
                case "ERROR":
                    $scope.alertType = "alert-danger";
                    break;
                case "WARNING":
                    $scope.alertType = "alert-warning";
                    break;
                case "INFO":
                    $scope.alertType = "alert-success";
                    break;
                default:
                    break;
                }
            }
        } else if (data === "false" || data === false) {
            $scope.alertType = "alert-danger";
        }
        $scope.message = messageToSend;
    };

    $scope.setAction = (action, data) => {
        if (action) {
            $scope.currentAction = action;
            $scope.currentActionData = data;

            $scope.stepPath = `dedicated/server/${$scope.currentAction}.html`;

            $("#currentAction").modal({
                keyboard: true,
                backdrop: "static"
            });
        } else {
            $("#currentAction").modal("hide");
            $scope.currentActionData = null;
            $timeout(() => {
                $scope.stepPath = "";
            }, 300);
        }
    };

    $scope.$on("dedicated.informations.reload", () => {
        loadServer();
    });


    function load () {
        User.getUrlOf("changeOwner").then((link) => {
            $scope.changeOwnerUrl = link;
        });

        $scope.loaders.autoRenew = true;

        $q
            .all({
                user: User.getUser(),
                paymentIds: User.getValidPaymentMeansIds()
            })
            .then((data) => {
                $scope.user = data.user;
                $scope.hasPaymentMean = data.paymentIds.length > 0;
                $scope.hasAutoRenew();
                checkIfStopBotherHousingPhone();
            })
            .finally(() => {
                $scope.loaders.autoRenew = false;
            });

        loadServer();
        loadMonitoring();
        getTaskInProgress();
    }

    function loadServer () {
        if (!$scope.disable.noDeleteMessage) {
            $scope.message = null;
        } else {
            $scope.disable.noDeleteMessage = false;
        }

        Server.getUrlRenew($stateParams.productId).then((url) => {
            $scope.urlRenew = url;
        });

        $q
            .allSettled([Server.getSelected($stateParams.productId), Server.getServiceInfos($stateParams.productId)])
            .then((data) => {
                const server = data[0];
                const serviceInfos = data[1];

                const expiration = moment.utc(server.expiration);
                server.expiration = moment([expiration.year(), expiration.month(), expiration.date()]).toDate();

                const creation = moment.utc(serviceInfos.creation);
                server.creation = moment([creation.year(), creation.month(), creation.date()]).toDate();

                /* if there is no os installed, the api return "none_64" */
                if (/^none_\d{2}?$/.test(server.os)) {
                    server.os = null;
                }

                $scope.server = server;
                $scope.infoServer = {
                    dc: $scope.server.datacenter.replace("_", " "),
                    dcImage: $scope.server.datacenter.replace(/_.*/g, ""),
                    rack: $scope.server.rack,
                    serverId: $scope.server.serverId
                };

                $scope.loadingServerInformations = false;
                $scope.isHousing = isHousing(server);
                $scope.serviceInfos = serviceInfos;
            })
            .catch((data) => {
                $scope.loadingServerInformations = false;
                $scope.loadingServerError = true;
                $scope.setMessage($translate.instant("server_dashboard_loading_error"), data);
            });
    }

    function loadMonitoring () {
        $q.all([Server.getModels(), Server.getAllServiceMonitoring($stateParams.productId)]).then(
            (data) => {
                $scope.monitoringProtocolEnum = data[0].data.models["dedicated.server.MonitoringProtocolEnum"].enum;
                $scope.serviceMonitoring = data[1];
                $scope.servicesStateLinks = {
                    weathermap: WEATHERMAP_URL,
                    vms: constants.vmsUrl,
                    travaux: constants.travauxUrl
                };
            },
            (err) => {
                $scope.setMessage($translate.instant("server_dashboard_loading_error"), err.data);
            }
        );
    }

    $scope.isMonitoringEnabled = (protocol) => $scope.serviceMonitoring.filter((monitoring) => monitoring.enabled && monitoring.protocol === protocol).length > 0;

    $scope.$on("server.monitoring.reload", loadMonitoring);

    // ---------- TASKS + Polling-------------

    $scope.$on("$destroy", () => {
        Polling.addKilledScope();
    });

    function getTaskInProgress () {
        Server.getTaskInProgress($stateParams.productId, "hardReboot").then((taskTab) => {
            if (taskTab.length > 0) {
                $scope.$broadcast("dedicated.informations.reboot", taskTab[0]);
            }
        });
        Server.getTaskInProgress($stateParams.productId, "resetIPMI").then((taskTab) => {
            // Do not call broadcast dedicated.ipmi.resetinterfaces
            if (taskTab.length > 0) {
                initIpmiRestart(taskTab[0]);
            }
        });
        Server.getTaskInProgress($stateParams.productId, "reinstallServer").then((taskTab) => {
            if (taskTab.length > 0) {
                $scope.$broadcast("dedicated.informations.reinstall", taskTab[0]);
            } else {
                checkInstallationProgress();
            }
        });
    }

    // Server Restart
    $scope.$on("dedicated.informations.reboot", (e, _task) => {
        let task = _task;
        $scope.disable.reboot = true;
        task = task.data;
        task.id = task.taskId;
        startPollRestart(task);
    });

    function startPollRestart (task) {
        Server.addTask($stateParams.productId, task, $scope.$id).then(
            (state) => {
                if (Polling.isResolve(state)) {
                    $scope.disable.reboot = false;
                    $scope.$broadcast("dedicated.informations.reboot.done");
                    $scope.setMessage($translate.instant("server_configuration_reboot_successfull", { t0: $scope.server.name }), true);
                } else {
                    startPollRestart(task);
                }
            },
            (data) => {
                $scope.disable.reboot = false;
                $scope.$broadcast("dedicated.informations.reboot.done");
                $scope.setMessage($translate.instant("server_configuration_reboot_fail_task"), data);
            }
        );
    }

    // Server Install
    $scope.$on("dedicated.informations.reinstall", (e, task) => {
        if (!$scope.disable.install) {
            $scope.disable.install = true;
            checkInstallationProgress(task);
        }
    });

    function checkInstallationProgress (task) {
        Server.progressInstallation($stateParams.productId).then(
            (installationStep) => {
                $scope.disable.installationInProgress = true;
                $scope.disable.installationInProgressError = false;
                angular.forEach(installationStep.progress, (value) => {
                    if (_.contains(errorStatus, value.status.toString().toLowerCase())) {
                        $scope.disable.installationInProgressError = true;
                        $scope.disable.install = false;
                    }
                });

                if (!$scope.disable.installationInProgressError && task) {
                    startPollReinstall(task);
                }
            },
            (err) => {
                if (err.status === 404) {
                    if ($scope.disable.installationInProgress) {
                        $scope.disable.noDeleteMessage = true;
                        $scope.setMessage($translate.instant("server_configuration_installation_progress_end"), true);
                        $scope.$broadcast("dedicated.informations.reload");
                    }
                    $scope.disable.install = false;
                    $scope.disable.installationInProgress = false;
                    $scope.disable.installationInProgressError = false;
                    return;
                }

                if (task) {
                    startPollReinstall(task);
                } else {
                    $scope.setMessage($translate.instant("server_configuration_installation_fail_task", { t0: $scope.server.name }), false);
                }
            }
        );
    }

    function startPollReinstall (task) {
        Server.addTask($stateParams.productId, task, $scope.$id)
            .then((state) => {
                if (Polling.isResolve(state)) {
                    if (Polling.isDone(state)) {
                        checkInstallationProgress();
                    }
                } else {
                    checkInstallationProgress(task);
                }
            })
            .catch((data) => {
                $scope.disable.install = false;
                $scope.setMessage($translate.instant("server_configuration_installation_fail_task", { t0: $scope.server.name }), data);
            });
    }

    // Auto renew
    $scope.hasAutoRenew = () => {
        $scope.autoRenew = false;
        if (NO_AUTORENEW_COUNTRIES.indexOf($scope.user.ovhSubsidiary) === -1) {
            return $q
                .all({
                    serverServiceInfo: Server.getServiceInfos($stateParams.productId),
                    isAutoRenewable: Server.isAutoRenewable($stateParams.productId)
                })
                .then((results) => {
                    $scope.autoRenew = results.serverServiceInfo.renew && results.serverServiceInfo.renew.automatic;
                    $scope.autoRenewable = results.isAutoRenewable;
                    $scope.autoRenewGuide = constants.urls[$scope.user.ovhSubsidiary].guides.autoRenew || constants.urls.FR.guides.autoRenew;
                    $scope.checkIfStopBotherAutoRenew();
                });
        }
        return $q.when(true);
    };

    $scope.stopBotherAutoRenew = () => {
        $scope.autoRenewStopBother = true;
        let serverArrayToStopBother = [];

        ovhUserPref
            .getValue("SERVER_AUTORENEW_STOP_BOTHER")
            .then((data) => {
                serverArrayToStopBother = data;
                return Server.getSelected($stateParams.productId);
            })
            .then((server) => {
                serverArrayToStopBother.push(server.name);
                return ovhUserPref.assign("SERVER_AUTORENEW_STOP_BOTHER", serverArrayToStopBother);
            })
            .catch((error) => error.status === 404 ? $scope.createStopBotherAutoRenewUserPref() : $scope.setMessage($translate.instant("server_autorenew_stop_bother_error"), error.data));
    };

    $scope.createStopBotherAutoRenewUserPref = () => {
        ovhUserPref.create("SERVER_AUTORENEW_STOP_BOTHER", [$scope.server.name]);
    };

    $scope.checkIfStopBotherAutoRenew = () =>
        ovhUserPref
            .getValue("SERVER_AUTORENEW_STOP_BOTHER")
            .then((serverToStopBother) => {
                $scope.autoRenewStopBother = _.indexOf(serverToStopBother, $scope.server.name) !== -1;
            })
            .catch((error) => (error.status === 404 ? ($scope.autoRenewStopBother = false) : $q.reject(error)));

    // IPMI Restart (other task by tab)
    $scope.$on("dedicated.ipmi.resetinterfaces", (e, task) => {
        initIpmiRestart(task);
    });

    function initIpmiRestart (task) {
        $scope.disable.byOtherTask = true;
        startIpmiPollRestart(task);
    }

    function startIpmiPollRestart (task) {
        $scope.disable.byOtherTask = true;
        Server.addTaskFast($stateParams.productId, task, $scope.$id)
            .then((state) => {
                if (Polling.isResolve(state)) {
                    $scope.disable.byOtherTask = false;
                } else {
                    startIpmiPollRestart(task);
                }
            })
            .catch(() => {
                $scope.disable.byOtherTask = false;
            });
    }

    $scope.createStopBotherUserPref = () => {
        ovhUserPref.create("HOUSING_SUPPORT_PHONE_STOP_BOTHER", true);
    };

    function checkIfStopBotherHousingPhone () {
        return ovhUserPref
            .getValue("HOUSING_SUPPORT_PHONE_STOP_BOTHER")
            .then((stopBother) => {
                $scope.housingPhoneStopBother = stopBother;
            })
            .catch(() => {
                $scope.housingPhoneStopBother = false;
            });
    }

    function isHousing (server) {
        return server.commercialRange === "housing";
    }

    load();
});
