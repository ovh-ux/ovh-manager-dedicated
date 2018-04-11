angular.module("App").controller("DedicatedCloudCtrl", [
    "$scope",
    "$timeout",
    "$stateParams",
    "$q",
    "$log",
    "featureAvailability",
    "step",
    "DedicatedCloud",
    "translator",
    "Module.services.notification",
    "User",
    function ($scope, $timeout, $stateParams, $q, $log, featureAvailability, step, DedicatedCloud, Translator, Notification, User) {
        "use strict";

        const tr = Translator.tr;
        $scope.HDS_READY_NOTIFICATION = "HDS_READY_NOTIFICATION";

        $scope.alerts = { dashboard: "dedicatedCloud_alert" };
        $scope.loadingInformations = true;
        $scope.loadingError = false;
        $scope.dedicatedCloud = null;
        $scope.featureAvailability = featureAvailability;

        $scope.notifications = {
            HDS_READY_NOTIFICATION: false
        };

        $scope.dedicatedCloudDescription = {
            model: null,
            editMode: false,
            loading: false
        };

        $scope.discount = {
            AMDPCC: false
        };

        $scope.dedicatedCloud = {};

        $scope.loadDedicatedCloud = function () {
            $scope.message = null;
            DedicatedCloud.getSelected($stateParams.productId, true)
                .then((dedicatedCloud) => {
                    Object.assign($scope.dedicatedCloud, dedicatedCloud);
                    $scope.dedicatedCloud.isExpired = dedicatedCloud.status === "expired";
                    if ($scope.dedicatedCloud.isExpired) {
                        $scope.setMessage(tr("common_expired"), { type: "cancelled" });
                    }
                    $scope.dedicatedCloudDescription.model = angular.copy($scope.dedicatedCloud.description);
                    loadNewPrices();
                    handleCancelConfirmation();
                    $scope.showHdsReadyNotificationIfRequired($scope.HDS_READY_NOTIFICATION);
                })
                .catch((data) => {
                    $scope.loadingError = true;
                    $scope.setMessage(tr("dedicatedCloud_dashboard_loading_error"), { message: data.message, type: "ERROR" });
                })
                .finally(() => {
                    $scope.loadingInformations = false;
                });
            DedicatedCloud.getDescription($stateParams.productId).then((dedicatedCloudDescription) => {
                Object.assign($scope.dedicatedCloud, dedicatedCloudDescription);
            });
        };

        $scope.$on("dedicatedcloud.informations.reload", () => {
            $scope.loadingInformations = true;
            $scope.loadDedicatedCloud();
        });

        $scope.editDescription = function () {
            if (!$scope.dedicatedCloudDescription.loading) {
                $scope.dedicatedCloudDescription.editMode = true;
                setTimeout(() => {
                    $("#textareaDedicatedDescription").focus();
                }, 200);
            }
        };

        $scope.setDescription = function () {
            $scope.dedicatedCloudDescription.editMode = false;
            $scope.dedicatedCloudDescription.loading = true;
            DedicatedCloud.updateDescription($stateParams.productId, $scope.dedicatedCloudDescription.model)
                .then(
                    (data) => {
                        $scope.setMessage(tr("dedicatedCloud_edit_description_success"), data);
                        $scope.dedicatedCloud.description = angular.copy($scope.dedicatedCloudDescription.model);
                    },
                    (data) => {
                        $scope.dedicatedCloudDescription.model = angular.copy($scope.dedicatedCloud.description);
                        $scope.setMessage(tr("dedicatedCloud_edit_description_fail", [$scope.dedicatedCloud.name]), data.data);
                    }
                )
                .finally(() => {
                    $scope.dedicatedCloudDescription.loading = false;
                });
        };

        $scope.cancelDescription = function () {
            $scope.dedicatedCloudDescription.editMode = false;
            $scope.dedicatedCloudDescription.model = angular.copy($scope.dedicatedCloud.description);
        };

        $scope.getRight = function (order) {
            return $scope.dedicatedCloud ? $.inArray(order, $scope.dedicatedCloud.orderRight) === -1 : false;
        };

        // Action + message

        $scope.resetAction = function () {
            $scope.setAction(false);
        };

        $scope.$on("$locationChangeStart", () => {
            $scope.resetAction();
        });

        $scope.setMessage = function (message, data) {
            let messageToSend = message;

            if (!data && !$scope.dedicatedCloud.isExpired) {
                $scope.message = messageToSend;
                return;
            }

            let errorType = "";
            if (data.type && !(data.idTask || data.taskId)) {
                errorType = data.type;
            } else if (data.state) {
                errorType = data.state;
            }

            switch (errorType.toLowerCase()) {
            case "blocked":
            case "cancelled":
            case "paused":
            case "error":
                $scope.alertType = "alert-danger";
                break;
            case "waiting_ack":
            case "waitingack":
            case "doing":
            case "warning":
            case "partial":
                $scope.alertType = "alert-warning";
                break;
            case "todo":
            case "done":
            case "info":
            case "ok":
                $scope.alertType = "alert-success";
                break;
            default:
                $scope.alertType = "alert-success";
                break;
            }

            if (data.message) {
                messageToSend += ` (${data.message})`;
            } else if (_.some(data.messages)) {
                const messageParts = _.map(data.messages, (_message) => `${_message.id} : ${_message.message}`);
                messageToSend = ` (${messageParts.join(", ")})`;
            }

            $scope.message = messageToSend;
        };

        $scope.setAction = function (action, data) {
            if (action) {
                $scope.currentAction = action;
                $scope.currentActionData = data;

                $scope.stepPath = `dedicatedCloud/${$scope.currentAction}.html`;

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

        $scope.contactMeForHds = function () {
            User.getUser()
                .then((user) => {
                    /* eslint-disable */
                    const message = `New HDS prospect ${user.nichandle}`;
                    const ticket = {
                        subject: message,
                        type: "genericRequest",
                        body: message,
                        serviceName: $stateParams.productId
                    };

                    // return Otrs.postTicket(ticket);
                    /* eslint-enable */
                })
                .then(() => {
                    $scope.stopNotification($scope.HDS_READY_NOTIFICATION);
                    $scope.setMessage(tr("dedicatedCloud_contact_me_success"));
                })
                .catch((error) => {
                    $scope.setMessage($scope.tr("dedicatedCloud_contact_me_fail"), { message: error.message, type: "ERROR" });
                    $log.error(error);
                });
        };

        $scope.stopNotification = function (notificationType) {
            $scope.notifications[notificationType] = false;
            Notification.stopNotification($scope.HDS_READY_NOTIFICATION, $stateParams.productId);
        };

        $scope.showHdsReadyNotificationIfRequired = function (notification) {
            if (_.startsWith($scope.dedicatedCloud.commercialRange.startsWith, "2014") || _.startsWith($scope.dedicatedCloud.commercialRange, "2016")) {
                showNotificationIfRequired(notification);
            }
        };

        $scope.getUserAccessPolicyLabel = function () {
            const policy = _.get($scope, "dedicatedCloud.userAccessPolicy");
            if (policy) {
                return tr(`dedicatedCloud_user_access_policy_${_.snakeCase(policy).toUpperCase()}`);
            }
            return "-";
        };

        function showNotificationIfRequired (notification) {
            Notification.checkIfStopNotification(notification, $stateParams.productId)
                .then((stopNotification) => {
                    $scope.notifications[notification] = !stopNotification;
                })
                .catch((error) => {
                    $scope.notifications[notification] = true;
                    $log.error(error);
                });
        }

        function handleCancelConfirmation () {
            if ($stateParams.action === "confirmcancel") {
                $scope.setAction("terminate/confirm/dedicatedCloud-terminate-confirm");
            }
        }

        function loadNewPrices () {
            return DedicatedCloud.getNewPrices($stateParams.productId).then((newPrices) => {
                $scope.newPriceInformation = newPrices.resources;
                $scope.hasChangePrices = newPrices.resources.filter((resource) => resource.changed === true).length > 0;
            });
        }

        $scope.loadDedicatedCloud();
    }
]);
