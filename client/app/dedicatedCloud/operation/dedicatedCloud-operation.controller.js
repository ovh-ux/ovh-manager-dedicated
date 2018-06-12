angular.module("App").controller("DedicatedCloudOperationsCtrl", function ($q, $state, $stateParams, $translate, $window, BillingOrders, Alerter, DedicatedCloud) {
    "use strict";

    const self = this;
    self.loading = false;

    function init () {
        self.loading = false;
        return DedicatedCloud.getModels().then((data) => {
            self.stateEnum = data.models["dedicatedCloud.TaskStateEnum"].enum;
        }).catch((err) => {
            Alerter.alertFromSWS($translate.instant("dedicatedCloud_OPERATIONS_error"), err, "dedicatedCloud_alert");
        }).finally(() => {
            self.loading = false;
        });
    }

    self.loadOperations = ({ offset, pageSize }) => {
        const opts = {};
        return DedicatedCloud.getOperations(
            $stateParams.productId,
            opts
        ).then((result) => {
            result.reverse();
            return {
                data: result.slice(offset - 1, offset - 1 + pageSize).map((id) => ({ id })),
                meta: {
                    totalCount: result.length
                }
            };
        });
    };

    self.loadOperation = (item) => DedicatedCloud.getOperation($stateParams.productId, {
        taskId: item.id
    }).then((op) => {
        const friendlyNameBy = $translate.instant(`dedicatedCloud_OPERATIONS_createdby_${op.createdBy.replace(/-/g, "_")}`);
        const friendlyNameFrom = $translate.instant(`dedicatedCloud_OPERATIONS_createdfrom_${op.createdFrom.replace(/-/g, "_")}`);
        op.createdBy = friendlyNameBy.startsWith("dedicatedCloud_OPERATIONS_createdby_") ? op.createdBy : friendlyNameBy;
        op.createdFrom = friendlyNameFrom.startsWith("dedicatedCloud_OPERATIONS_createdfrom_") ? op.createdFrom : friendlyNameFrom;
        op.isDone = _.includes(["canceled", "done"], op.state);
        return op;
    }).then(setOperationDescription).then(setRelatedServices);

    function setRelatedServices (operation) {
        const baseTrad = "dedicatedCloud_OPERATIONS_related_";
        operation.relatedServices = [];

        // related service that could not be links
        _.each(["networkAccessId", "parentTaskId"], (field) => {
            const value = operation[field];
            if (!_.isNull(value)) {
                operation.relatedServices.push({
                    label: $translate.instant(`${baseTrad}${field}`, {
                        t0: value
                    }),
                    field
                });
            }
        });

        // related service where we can generate an url to link it.
        _.each(["datacenterId", "hostId", "filerId"], (field) => {
            const value = operation[field];
            if (value) {
                let action = angular.noop;

                switch (field) {
                case "datacenterId":
                    action = () => $state.go("app.dedicatedClouds.datacenter", {
                        productId: $stateParams.productId,
                        datacenterId: operation.datacenterId
                    });
                    break;
                case "hostId":
                    action = () => $state.go("app.dedicatedClouds.datacenter.hosts", {
                        productId: $stateParams.productId,
                        datacenterId: operation.datacenterId
                    });
                    break;
                case "filerId":
                    action = () => $state.go("app.dedicatedClouds.datacenter.datastores", {
                        productId: $stateParams.productId,
                        datacenterId: operation.datacenterId
                    });
                    break;
                default:
                    break;
                }

                operation.relatedServices.push({
                    label: $translate.instant(`${baseTrad}${field}`, {
                        t0: value
                    }),
                    action,
                    field
                });
            }
        });

        _.each(["userId"], (field) => {
            if (operation.userId) {
                operation.relatedServices.push({
                    label: $translate.instant(`${baseTrad}userId`, {
                        t0: operation.userId
                    }),
                    action: () => {
                        $state.go("app.dedicatedClouds.users");
                    },
                    field
                });
            }
        });

        // related service that are a callback for onClick because we cannot do a direct link to them
        // order need to fetch the order to get it's url, so we don't want to do it for all order, we fetch it on request
        _.each(["orderId"], (field) => {
            if (operation.orderId) {
                const params = _.pick(operation, ["datacenterId", "serviceName"]);
                params[field] = operation.orderId;
                operation.relatedServices.push({
                    label: $translate.instant(`${baseTrad}${field}`, {
                        t0: operation.orderId
                    }),
                    action: () => BillingOrders.getOrder(operation.orderId).then((order) => {
                        $window.open(order.url);
                    }).catch((err) => {
                        Alerter.alertFromSWS($translate.instant("dedicatedCloud_OPERATIONS_error"), err, "dedicatedCloud_alert");
                    }),
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

    init();
});
