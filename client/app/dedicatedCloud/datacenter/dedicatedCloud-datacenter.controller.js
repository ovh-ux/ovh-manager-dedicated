angular.module("App").controller("DedicatedCloudSubDatacenterCtrl", ($location, $scope, $stateParams, $timeout, $translate, $uibModal, DedicatedCloud) => {
    "use strict";

    $scope.loadingInformations = true;
    $scope.loadingError = false;
    $scope.datacenter = {
        model: null
    };
    $scope.datacenterDescription = {
        model: null,
        editMode: false,
        loading: false
    };
    $scope.datacenterName = {
        model: null,
        editMode: false,
        loading: false
    };

    $scope.$on("datacenter.informations.reload", () => {
        $scope.loadDatacenter();
    });

    $scope.loadDatacenter = function () {
        $scope.message = null;
        DedicatedCloud.getDatacenterInformations($stateParams.productId, $stateParams.datacenterId, true).then(
            (datacenter) => {
                $scope.datacenter.model = datacenter;
                $scope.datacenter.model.id = $stateParams.datacenterId;
                $scope.datacenterDescription.model = angular.copy($scope.datacenter.model.description);
                $scope.datacenterName.model = angular.copy($scope.datacenter.model.name);
                $scope.loadingInformations = false;
            },
            (data) => {
                $scope.loadingInformations = false;
                $scope.loadingError = true;
                $scope.setMessage($translate.instant("dedicatedCloud_dashboard_loading_error"), angular.extend(data, { type: "ERROR" }));
            }
        );
        DedicatedCloud.getDescription($stateParams.productId).then((dedicatedCloudDescription) => {
            $scope.dedicatedCloud = angular.extend($scope.dedicatedCloud || {}, dedicatedCloudDescription);
        });
    };

    /* Update description or name */

    $scope.editDescription = function (value, contextTitle) {
        const modal = $uibModal.open({
            animation: true,
            templateUrl: "components/name-edition/name-edition.html",
            controller: "NameEditionCtrl",
            controllerAs: "$ctrl",
            resolve: {
                data () {
                    return {
                        contextTitle,
                        datacenterId: $stateParams.datacenterId,
                        productId: $stateParams.productId,
                        value
                    };
                }
            }
        });

        modal.result.then((newValue) => {
            if (contextTitle === "dedicatedCloud_datacenter_name") {
                $scope.datacenterName.model = newValue;
            } else {
                $scope.datacenterDescription.model = newValue;
            }
        });
    };

    $scope.loadDatacenter();

    $scope.resetAction = function () {
        $scope.setAction(false);
    };

    $scope.setMessage = function (message, data) {
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
                    $scope.alertType = "alert-warning";
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
                        $scope.alertType = "alert-warning";
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
            }
        }
        $scope.message = messageToSend;
    };

    $scope.setAction = function (action, data, parent) {
        if (action) {
            $scope.currentAction = action;
            $scope.currentActionData = data;

            if (parent) {
                $scope.stepPath = `dedicatedCloud/${$scope.currentAction}.html`;
            } else {
                $scope.stepPath = `dedicatedCloud/${$scope.currentAction}.html`;
            }

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

});
