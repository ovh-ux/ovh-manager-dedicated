angular.module("App").controller("DedicatedCloudSubDatacenterVeeamCtrl", ($scope, $stateParams, DedicatedCloud, $rootScope, VEEAM_STATE_ENUM) => {
    "use strict";

    $scope.veeam = {
        model: null,
        constants: VEEAM_STATE_ENUM
    };
    $scope.loading = false;

    $rootScope.$on("datacenter.veeam.reload", () => {
        $scope.loadVeeam(true);
    });

    $scope.loadVeeam = function (forceRefresh) {
        $scope.loading = true;

        return DedicatedCloud.getVeeam($stateParams.productId, $stateParams.datacenterId, forceRefresh).then((veeam) => {
            $scope.veeam.model = veeam;
            $scope.loading = false;
        }, (data) => {
            $scope.loading = false;
            $scope.setMessage($scope.tr("dedicatedCloud_tab_veeam_loading_error"), angular.extend(data, { type: "ERROR" }));
        });
    };

    $scope.canBeActivated = function () {
        return $scope.veeam.model && $scope.veeam.model.state === $scope.veeam.constants.DISABLED;
    };

    $scope.canBeDisabled = function () {
        return $scope.veeam.model && $scope.veeam.model.state === $scope.veeam.constants.ENABLED;
    };

    $scope.loadVeeam();
});
