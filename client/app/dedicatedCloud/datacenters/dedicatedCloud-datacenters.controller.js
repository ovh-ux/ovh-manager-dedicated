angular.module("App").controller("DedicatedCloudDatacentersCtrl", ($scope, $stateParams, DedicatedCloud) => {
    "use strict";

    $scope.datacenters = null;

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
});
