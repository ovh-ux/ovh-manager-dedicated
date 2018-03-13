angular.module("App").controller("DedicatedCloudSubDatacenterCtrl", ($scope, $stateParams, $timeout, $location, DedicatedCloud, translator) => {
    "use strict";

    const tr = translator.tr;

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
                $scope.setMessage($scope.tr("dedicatedCloud_dashboard_loading_error"), angular.extend(data, { type: "ERROR" }));
            }
        );
        DedicatedCloud.getDescription($stateParams.productId).then((dedicatedCloudDescription) => {
            $scope.dedicatedCloud = angular.extend($scope.dedicatedCloud || {}, dedicatedCloudDescription);
        });
    };

    /* Update Field*/

    $scope.editField = function (field, textareaFocus) {
        if (!field.loading) {
            field.editMode = true;
            setTimeout(() => {
                $(textareaFocus).focus();
            }, 200);
        }
    };

    $scope.cancelField = function (field, saveValue) {
        field.editMode = false;
        field.model = angular.copy(saveValue);
    };

    /* Update Name*/

    $scope.setName = function () {
        $scope.datacenterName.editMode = false;
        $scope.datacenterName.loading = true;
        DedicatedCloud.updateDatacenterName($stateParams.productId, $stateParams.datacenterId, $scope.datacenterName.model).then(
            () => {
                $scope.setMessage(tr("dedicatedCloud_datacenter_edit_name_success"), true);
                $scope.datacenter.model.description = angular.copy($scope.datacenterName.model);
                $scope.datacenterName.loading = false;
            },
            (data) => {
                $scope.datacenterName.model = angular.copy($scope.datacenter.model.name);
                $scope.setMessage(tr("dedicatedCloud_datacenter_edit_name_fail", [$scope.datacenter.model.name]), angular.extend(data, { type: "ERROR" }));
                $scope.datacenterName.loading = false;
            }
        );
    };

    /* Update description */

    $scope.setDescription = function () {
        $scope.datacenterDescription.editMode = false;
        $scope.datacenterDescription.loading = true;
        DedicatedCloud.updateDatacenterDescription($stateParams.productId, $stateParams.datacenterId, $scope.datacenterDescription.model).then(
            () => {
                $scope.setMessage(tr("dedicatedCloud_datacenter_edit_description_success"), true);
                $scope.datacenter.model.description = angular.copy($scope.datacenterDescription.model);
                $scope.datacenterDescription.loading = false;
            },
            (data) => {
                $scope.datacenterDescription.model = angular.copy($scope.datacenter.model.description);
                $scope.setMessage(tr("dedicatedCloud_datacenter_edit_description_fail", [$scope.datacenter.model.name]), angular.extend(data, { type: "ERROR" }));
                $scope.datacenterDescription.loading = false;
            }
        );
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
