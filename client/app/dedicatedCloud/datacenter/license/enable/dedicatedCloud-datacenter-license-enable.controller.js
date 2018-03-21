angular.module("App").controller("DedicatedCloudSubDatacenterLicencesSplaEnableCtrl", ($scope, $stateParams, DedicatedCloud, $rootScope) => {
    "use strict";

    $scope.spla = {
        agreeContract: false,
        model: null,
        loading: false
    };

    $scope.loadActiveSpla = function () {
        $scope.spla.loading = true;
        DedicatedCloud.getSplaOrder($stateParams.productId).then(
            (order) => {
                $scope.spla.model = order;
                $scope.spla.loading = false;
            },
            (data) => {
                $scope.spla.loading = false;
                $scope.resetAction();
                $scope.setMessage($scope.tr("dedicatedCloud_tab_licences_active_spla_load_fail"), angular.extend(data, { type: "ERROR" }));
            }
        );
    };

    $scope.enableSpla = function () {
        $scope.spla.loading = true;
        DedicatedCloud.postSplaOrder($stateParams.productId).then(
            (data) => {
                $scope.spla.loading = false;
                $scope.resetAction();
                window.open(data.url, "_blank");
                $scope.setMessage($scope.tr("dedicatedCloud_tab_licences_active_spla_success", [data.url, data.orderId]), true);
            },
            (data) => {
                $scope.spla.loading = false;
                $scope.resetAction();
                $rootScope.$broadcast("datacenter.veeam.reload");
                $scope.setMessage($scope.tr("dedicatedCloud_tab_licences_active_spla_fail"), angular.extend(data, { type: "ERROR" }));
            }
        );
    };
});
