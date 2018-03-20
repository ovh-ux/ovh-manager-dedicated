angular.module("App").controller("DedicatedCloudDatacentersCtrl", ($q, $scope, $state, $stateParams, constants, DedicatedCloud) => {
    "use strict";

    $scope.loadDatacenters = ({ offset, pageSize }) => DedicatedCloud.getDatacentersInformations($stateParams.productId, pageSize, offset - 1).then((result) => ({
        data: _.get(result, "list.results"),
        meta: {
            totalCount: result.count
        }
    })).catch((err) => {
        $scope.resetAction();
        $scope.setMessage($scope.tr("dedicatedCloud_datacenters_loading_error"), {
            message: err.message,
            type: "ERROR"
        });
        return $q.reject(err);
    }).finally(() => {
        $scope.loading = false;
    });

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
