angular.module("App").controller("DedicatedCloudOperationsCtrl", [
    "$scope",
    "$q",
    "$window",
    "DedicatedCloud",
    "BillingOrders",
    "Alerter",
    "$stateParams",
    function ($scope, $q, $window, DedicatedCloud, Orders, Alerter, $stateParams) {
        "use strict";

        const self = this;
        self.operationIds = [];
        self.operations = [];
        self.stateEnum = [];
        self.stateFilter = null;
        self.doneStates = ["canceled", "done"];
        self.loaders = {
            operations: false,
            models: false,
            updating: false
        };

        self.getOperations = function () {
            self.operationIds = [];
            self.loaders.operations = true;
            const opts = {};
            if (self.stateFilter) {
                opts.params = {
                    state: self.stateFilter
                };
            }
            DedicatedCloud.getOperations($stateParams.productId, opts)
                .then((operationIds) => {
                    self.operationIds = operationIds.reverse();
                })
                .catch((err) => {
                    Alerter.alertFromSWS($scope.tr("dedicatedCloud_OPERATIONS_error"), err, "dedicatedCloud_alert");
                })
                .finally(() => {
                    self.loaders.operations = false;
                });
        };

        self.getOperation = function (item) {
            self.loaders.operations = true;
            return DedicatedCloud.getOperation($stateParams.productId, { taskId: item })
                .then((op) => {
                    const friendlyNameBy = $scope.tr(`dedicatedCloud_OPERATIONS_createdby_${op.createdBy.replace(/-/g, "_")}`);
                    const friendlyNameFrom = $scope.tr(`dedicatedCloud_OPERATIONS_createdfrom_${op.createdFrom.replace(/-/g, "_")}`);
                    op.createdBy = friendlyNameBy.indexOf("/!\\") === 0 ? op.createdBy : friendlyNameBy;
                    op.createdFrom = friendlyNameFrom.indexOf("/!\\") === 0 ? op.createdFrom : friendlyNameFrom;
                    op.isDone = _.includes(self.doneStates, op.state);
                    return op;
                })
                .then(setOperationDescription)
                .then(setRelatedServices);
        };

        self.showRelatedService = function (params) {
            if (params.userId) {
                $scope.setSelectedTab("USERS");
            } else if (params.orderId) {
                Orders.getOrder(params.orderId)
                    .then((order) => {
                        $window.open(order.url);
                    })
                    .catch((err) => {
                        Alerter.alertFromSWS($scope.tr("dedicatedCloud_OPERATIONS_error"), err, "dedicatedCloud_alert");
                    });
            }
        };

        self.toggleExpandOperation = function (event, operation) {
            // only toggle if the click is on the <li> or the icon itself, not the inner elements
            if (parseInt(event.target.id, 10) === parseInt(operation.taskId, 10) || !_.isEmpty(_.union(event.target.classList, ["related-task-expanded", "related-task-collapsed"]))) {
                operation.expanded = !operation.expanded;
            }
        };

        function setRelatedServices (operation) {
            const baseTrad = "dedicatedCloud_OPERATIONS_related_";
            operation.relatedServices = [];
            operation.expanded = false;

            // related service that could not be links
            _.each(["networkAccessId", "parentTaskId"], (field) => {
                const value = operation[field];
                if (!_.isNull(value)) {
                    operation.relatedServices.push({
                        label: $scope.tr(baseTrad + field, [value]),
                        action: { type: "label" },
                        field
                    });
                }
            });

            // related service where we can generate an url to link it.
            _.each(["datacenterId", "hostId", "filerId"], (field) => {
                const value = operation[field];
                if (!_.isNull(value)) {
                    let url;
                    switch (field) {
                    case "datacenterId":
                        url = `#/configuration/dedicated_cloud/${self.name}/datacenter/${operation.datacenterId}`;
                        break;
                    case "hostId":
                        url = `#/configuration/dedicated_cloud/${self.name}/datacenter/${operation.datacenterId}?tab=HOSTS`;
                        break;
                    case "filerId":
                        url = `#/configuration/dedicated_cloud/${self.name}/datacenter/${operation.datacenterId}?tab=DATASTORES`;
                        break;
                    default:
                        break;
                    }

                    operation.relatedServices.push({
                        label: $scope.tr(baseTrad + field, [value]),
                        action: { type: "url", url },
                        field
                    });
                }
            });

            // related service that are a callback for onClick because we cannot do a direct link to them
            // order need to fetch the order to get it's url, so we don't want to do it for all order, we fetch it on request
            // user is a different tab, so the url only as a different params in it, it wont trigger the desired effect (tab change) if set as an href.
            _.each(["orderId", "userId"], (field) => {
                const value = operation[field];
                if (!_.isNull(value)) {
                    const params = _.pick(operation, ["datacenterId", "serviceName"]);
                    params[field] = value;
                    operation.relatedServices.push({
                        label: $scope.tr(baseTrad + field, [value]),
                        action: { type: "callback", params },
                        field
                    });
                }
            });

            return operation;
        }

        function setOperationDescription (operation) {
            if (operation.description === "") {
                return DedicatedCloud.getOperationDescription($stateParams.productId, { name: operation.name }).then((robot) => {
                    operation.description = robot.description;
                    return operation;
                });
            }
            return $q.when(operation);
        }

        self.showOrder = function (id) {
            return id;
        };

        self.onOperationsDone = function () {
            self.loaders.operations = false;
        };

        self.onStateChanged = function () {
            self.getOperations($stateParams.productId, true);
        };

        self.updateOperation = function (operation) {
            self.loaders.updating = true;
            DedicatedCloud.updateOperation($stateParams.productId, {
                taskId: operation.taskId,
                data: { executionDate: operation.executionDate }
            })
                .then(() => {
                    Alerter.success($scope.tr("dedicatedCloud_OPERATIONS_success"), "dedicatedCloud_alert");
                })
                .catch((err) => {
                    Alerter.alertFromSWS($scope.tr("dedicatedCloud_OPERATIONS_error"), err, "dedicatedCloud_alert");
                })
                .finally(() => {
                    self.loaders.updating = false;
                });
        };

        function init () {
            self.loaders.models = true;
            self.getOperations($stateParams.productId);
            DedicatedCloud.getModels()
                .then((data) => {
                    self.stateEnum = data.models["dedicatedCloud.TaskStateEnum"].enum;
                })
                .catch((err) => {
                    Alerter.alertFromSWS($scope.tr("dedicatedCloud_OPERATIONS_error"), err, "dedicatedCloud_alert");
                })
                .then(DedicatedCloud.getSelected)
                .then((cloud) => {
                    self.name = cloud.name;
                })
                .finally(() => {
                    self.loaders.models = false;
                });
        }

        init();
    }
]);
