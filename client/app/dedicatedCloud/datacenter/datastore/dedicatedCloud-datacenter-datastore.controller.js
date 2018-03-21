angular.module("App").controller("DedicatedCloudSubDatacentersDatastoreCtrl", ($scope, $stateParams, DedicatedCloud) => {
    "use strict";

    $scope.datastores = null;
    $scope.loading = false;

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
