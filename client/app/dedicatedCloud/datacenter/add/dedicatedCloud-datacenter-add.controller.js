angular.module("App").controller("DedicatedCloudDatacentersAddCtrl", ($scope, $stateParams, DedicatedCloud, COMMERCIAL_RANGE_ENUM) => {
    "use strict";

    $scope.loader = false;

    $scope.commercialRange = {
        list: [],
        model: null,
        constants: COMMERCIAL_RANGE_ENUM
    };

    $scope.load = function () {
        $scope.loader = true;

        DedicatedCloud.getCommercialRangeList($stateParams.productId)
            .then(
                (list) => {
                    $scope.commercialRange.list = list;
                },
                (data) => {
                    $scope.resetAction();
                    $scope.setMessage($scope.tr("dedicatedCloud_datacenters_adding_load_error"), angular.extend(data, { type: "ERROR" }));
                }
            )
            .finally(() => {
                $scope.loader = false;
            });
    };

    $scope.addDatacenter = function () {
        $scope.resetAction();
        DedicatedCloud.addDatacenter($stateParams.productId, $scope.commercialRange.model).then(
            () => {
                $scope.setMessage($scope.tr("dedicatedCloud_datacenters_adding_success"), true);
            },
            (data) => {
                $scope.setMessage($scope.tr("dedicatedCloud_datacenters_adding_error"), angular.extend(data, { type: "ERROR" }));
            }
        );
    };
});
