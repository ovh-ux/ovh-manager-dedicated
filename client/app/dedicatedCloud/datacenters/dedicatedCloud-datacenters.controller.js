angular.module("App").controller("DedicatedCloudDatacentersCtrl", ($scope, $state, $stateParams, constants, DedicatedCloud) => {
    "use strict";

    $scope.datacenters = null;
    $scope.constants = constants;

    $scope.loadDatacenters = function (elementsByPage, elementsToSkip) {
        $scope.loading = true;
        $scope.error = false;
        DedicatedCloud.getDatacentersInformations($stateParams.productId, elementsByPage, elementsToSkip)
            .then(
                (datacenters) => {
                    $scope.datacenters = datacenters;
                },
                (data) => {
                    $scope.resetAction();
                    $scope.error = true;
                    $scope.setMessage($scope.tr("dedicatedCloud_datacenters_loading_error"), {
                        message: data.message,
                        type: "ERROR"
                    });
                }
            )
            .finally(() => {
                $scope.loading = false;
            });
    };

    $scope.hasDiscount = function (datacenter) {
        const hasDiscount = DedicatedCloud.hasDiscount(datacenter);
        if (hasDiscount) {
            $scope.discount.AMDPCC = true;
        }
        return hasDiscount;
    };

    $scope.orderDatastore = (datacenter) => {
        if (constants.target === "US") {
            $state.go("app.dedicatedClouds.datacenter.datastores.orderUS", {
                datacenterId: datacenter.id
            });
        } else {
            $scope.setAction("datacenter/datastore/order/dedicatedCloud-datacenter-datastore-order", datacenter, true);
        }
    };

    $scope.orderHost = (datacenter) => {
        if (constants.target === "US") {
            $state.go("app.dedicatedClouds.datacenter.hosts.orderUS", {
                datacenterId: datacenter.id
            });
        } else {
            $scope.setAction("datacenter/host/order/dedicatedCloud-datacenter-host-order", datacenter, true);
        }
    };
});
