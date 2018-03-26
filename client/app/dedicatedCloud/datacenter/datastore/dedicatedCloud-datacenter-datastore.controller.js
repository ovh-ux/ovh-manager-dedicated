angular.module("App").controller("DedicatedCloudSubDatacentersDatastoreCtrl", ($scope, $state, $stateParams, DedicatedCloud, constants) => {
    "use strict";

    $scope.datastores = null;
    $scope.loading = false;
    $scope.constants = constants;

    const noConsumptionResponse = new RegExp("no consumption", "i");

    $scope.loadDatastores = function (elementsByPage, elementsToSkip) {
        $scope.loading = true;
        DedicatedCloud.getDatastores($stateParams.productId, $stateParams.datacenterId, elementsByPage, elementsToSkip).then(
            (datastores) => {
                $scope.datastores = datastores;
                _.each(datastores.list.results, setHourlyUsage);
                $scope.loading = false;
            },
            (data) => {
                $scope.loading = false;
                $scope.setMessage($scope.tr("dedicatedCloud_tab_datastores_loading_error"), angular.extend(data, { type: "ERROR" }));
            }
        );
    };

    $scope.orderDatastore = (datacenter) => {
        if (constants.target === "US") {
            $state.go("app.dedicatedClouds.datacenter.datastores.orderUS");
        } else {
            $scope.setAction("datacenter/datastore/order/dedicatedCloud-datacenter-datastore-order", datacenter.model, true);
        }
    };

    function setHourlyUsage (store) {
        if (store.billing === "HOURLY") {
            DedicatedCloud.getDatastoreHourlyConsumption($stateParams.productId, $stateParams.datacenterId, store.id)
                .then((response) => {
                    store.consumption = response.consumption.value;
                    store.consumptionLastUpdate = response.lastUpdate;
                })
                .catch((err) => {
                    if (noConsumptionResponse.test(err.message)) {
                        store.consumption = 0;
                    } else {
                        store.consumption = NaN;
                    }
                });
        } else {
            store.consumption = "";
        }
    }
});
